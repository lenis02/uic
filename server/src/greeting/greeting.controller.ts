import {
  Controller,
  Get,
  Post,
  Patch, // 👈 [중요] Patch 추가
  Body,
  Param, // 👈 [중요] Param 추가
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GreetingService } from './greeting.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { multerOptions } from '../common/utils/multer.options';

@Controller('greeting')
export class GreetingController {
  constructor(private readonly greetingService: GreetingService) {}

  @Get()
  findAll() {
    return this.greetingService.findAll();
  }

  @Get(':role')
  async findOne(@Param('role') role: string) {
    return await this.greetingService.findOne(role);
  }

  // 👇 [기존에 있던 POST] (보통 처음 생성할 때 사용)
  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @Body() dto: CreateGreetingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;
    return await this.greetingService.createOrUpdate(dto, imageUrl);
  }

  // 👇 [이걸 추가해야 합니다!] PATCH 요청 처리기
  @Patch(':role')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async update(
    @Param('role') role: string, // URL에서 직책(President 등)을 가져옴
    @Body() dto: CreateGreetingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? `/uploads/${file.filename}` : undefined;

    // URL로 받은 role을 DTO에 강제로 덮어씌워서 서비스로 보냄 (안전장치)
    return await this.greetingService.createOrUpdate(
      { ...dto, role },
      imageUrl,
    );
  }
}
