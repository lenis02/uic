// src/modules/research/research.controller.ts
import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResearchService } from './research.service';
import { CreateResearchDto } from './dto/create-research.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { multerOptions } from '../common/utils/multer.options';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get() // 리서치 목록 조회 (누구나)
  findAll() {
    return this.researchService.findAll();
  }

  @Post() // 리서치 등록 (관리자만)
  @ApiBearerAuth() // 이 API는 로그인이 필요하다고 표시
  @ApiConsumes('multipart/form-data') // 파일 업로드 UI 활성화
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'pdf', maxCount: 1 },
        { name: 'thumbnail', maxCount: 1 },
      ],
      multerOptions,
    ),
  )
  async create(
    @Body() createResearchDto: CreateResearchDto,
    @UploadedFiles()
    files: { pdf?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    const pdfUrl = files.pdf ? `/uploads/${files.pdf[0].filename}` : '';
    const thumbnailUrl = files.thumbnail
      ? `/uploads/${files.thumbnail[0].filename}`
      : '';

    return this.researchService.create(createResearchDto, pdfUrl, thumbnailUrl);
  }

  @Delete(':id') // 리서치 삭제 (관리자만)
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.researchService.remove(+id);
  }
}
