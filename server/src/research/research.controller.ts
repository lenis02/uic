import {
  Controller,
  Post,
  Patch, // Patch 추가
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
  ParseIntPipe,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ResearchService } from './research.service';
import { CreateResearchDto } from './dto/create-research.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  findAll() {
    return this.researchService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pdf', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async create(
    @Body() createResearchDto: CreateResearchDto,
    @UploadedFiles()
    files: { pdf?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    // 파일 객체를 통째로 서비스로 넘김
    return this.researchService.create(createResearchDto, files || {});
  }

  // [수정 API 추가]
  @Patch(':id')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'pdf', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 },
    ]),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResearchDto: CreateResearchDto, // DTO 재사용 (Partial로 처리됨)
    @UploadedFiles()
    files: { pdf?: Express.Multer.File[]; thumbnail?: Express.Multer.File[] },
  ) {
    return this.researchService.update(id, updateResearchDto, files || {});
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.researchService.remove(+id);
  }

  // 조회수 증가 API
  @Patch(':id/views')
  async increaseViewCount(@Param('id') id: string) {
    return await this.researchService.increaseViewCount(+id);
  }
}
