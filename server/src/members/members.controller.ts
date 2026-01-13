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
  ParseIntPipe,
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

  // [수정] 생성 시에도 이미지가 있을 수 있으므로 Interceptor 추가 권장
  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions)) // 'image' 키 확인
  create(
    @Body() dto: CreateMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.membersService.create(dto, file);
  }

  // [핵심 수정] update 메서드에서 파일 처리 추가
  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', multerOptions)) // 프론트엔드의 formData key인 'image'와 일치해야 함
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateMemberDto>,
    @UploadedFile() file?: Express.Multer.File, // 파일이 있으면 받음
  ) {
    // 서비스로 파일도 함께 전달
    return this.membersService.update(id, dto, file);
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
