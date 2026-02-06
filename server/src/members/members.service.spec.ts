import { Test, TestingModule } from '@nestjs/testing';
import { MembersService } from './members.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Member } from './entities/member.entity';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { NotFoundException } from '@nestjs/common';
import { CreateMemberDto } from './dto/create-member.dto';

// 1. 가짜 Cloudinary 서비스
const mockCloudinaryService = {
  uploadImage: jest
    .fn()
    .mockResolvedValue({ secure_url: 'https://mock-url.com/image.jpg' }),
};

// 2. 가짜 Repository (DB)
const mockMemberRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('MembersService', () => {
  let service: MembersService;
  let repository: typeof mockMemberRepository;
  let cloudinary: typeof mockCloudinaryService;

  beforeEach(async () => {
    // 👇 여기가 핵심! providers 안에 3개가 꽉 차 있어야 합니다.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MembersService,
        {
          provide: getRepositoryToken(Member),
          useValue: mockMemberRepository,
        },
        {
          provide: CloudinaryService,
          useValue: mockCloudinaryService,
        },
      ],
    }).compile();

    service = module.get<MembersService>(MembersService);
    repository = module.get(getRepositoryToken(Member));
    cloudinary = module.get(CloudinaryService);

    jest.clearAllMocks();
  });

  it('서비스가 정의되어 있어야 한다', () => {
    expect(service).toBeDefined();
  });

  // --- 1. 멤버 생성 테스트 ---
  describe('create', () => {
    it('파일 없이 멤버를 생성하면 imageUrl은 null이어야 한다', async () => {
      // DTO 타입 맞추기 (as any 사용)
      const dto = {
        name: 'Test Member',
        position: 'Member',
        generation: 19,
        workplace: '',
        email: '',
      } as CreateMemberDto;

      mockMemberRepository.create.mockReturnValue(dto);
      mockMemberRepository.save.mockResolvedValue({
        id: 1,
        ...dto,
        imageUrl: null,
      } as any);

      const result = await service.create(dto);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Test Member' }),
      );
      expect(result.imageUrl).toBeNull();
    });

    it('파일이 있으면 Cloudinary에 업로드하고 URL을 저장해야 한다', async () => {
      const dto = {
        name: 'Test Member',
        position: 'Member',
        generation: 19,
        workplace: '',
        email: '',
      } as CreateMemberDto;

      const mockFile = { buffer: Buffer.from('test') } as Express.Multer.File;

      mockMemberRepository.create.mockReturnValue({
        ...dto,
        imageUrl: 'https://mock-url.com/image.jpg',
      });
      mockMemberRepository.save.mockResolvedValue({
        id: 1,
        ...dto,
        imageUrl: 'https://mock-url.com/image.jpg',
      } as any);

      await service.create(dto, mockFile);

      expect(cloudinary.uploadImage).toHaveBeenCalledWith(mockFile);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          imageUrl: 'https://mock-url.com/image.jpg',
        }),
      );
    });
  });

  // --- 2. 멤버 수정 테스트 ---
  describe('update', () => {
    it('존재하지 않는 멤버를 수정하려 하면 에러를 던져야 한다', async () => {
      mockMemberRepository.findOne.mockResolvedValue(null);
      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });

    it('멤버 정보를 수정하고 저장해야 한다', async () => {
      const existingMember = { id: 1, name: 'Old Name', imageUrl: 'old.jpg' };
      const updateDto = { name: 'New Name' };

      mockMemberRepository.findOne.mockResolvedValue(existingMember);
      mockMemberRepository.save.mockResolvedValue({
        ...existingMember,
        ...updateDto,
      } as any);

      const result = await service.update(1, updateDto);

      expect(repository.save).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New Name' }),
      );
      expect(result.name).toBe('New Name');
    });
  });

  // --- 3. 다음 기수 생성 테스트 ---
  describe('createNextGeneration', () => {
    it('마지막 기수가 19기라면 20기 멤버들을 생성해야 한다', async () => {
      mockMemberRepository.findOne.mockResolvedValue({ generation: 19 } as any);

      const defaultPositionsCount = 7;

      await service.createNextGeneration();

      expect(repository.create).toHaveBeenCalledTimes(defaultPositionsCount);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          generation: 20,
          position: '회장',
        }),
      );
    });
  });
});
