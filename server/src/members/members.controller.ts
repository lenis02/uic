// src/modules/members/members.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe, // ID 파싱을 위해 추가하면 좋습니다
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utils/multer.options';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(@Query('gen') gen?: string) {
    if (gen) return this.membersService.findByGeneration(+gen);
    return this.membersService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() dto: CreateMemberDto) {
    return this.membersService.create(dto);
  }

  // 수정 로직: ParseIntPipe를 사용해 숫자로 확실하게 변환
  @Patch(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateMemberDto>,
  ) {
    return this.membersService.update(id, dto);
  }

  @Patch(':id/profile')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadProfile(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const profileImageUrl = `/uploads/${file.filename}`;
    // 파일 경로만 업데이트하는 것도 기존 update 로직 재사용
    return await this.membersService.update(id, { profileImageUrl });
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.remove(id);
  }

  @Post('next-gen')
  @UseGuards(AdminGuard)
  async createNextGen() {
    return await this.membersService.createNextGeneration();
  }
}
