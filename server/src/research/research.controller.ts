import {
  Controller,
  Post,
  Patch,
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
import { researchUploadOptions } from '../common/utils/multer.options';

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
    FileFieldsInterceptor([{ name: 'pdf', maxCount: 1 }], researchUploadOptions),
  )
  async create(
    @Body() createResearchDto: CreateResearchDto,
    @UploadedFiles() files: { pdf?: Express.Multer.File[] },
  ) {
    return this.researchService.create(createResearchDto, files || {});
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseGuards(AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'pdf', maxCount: 1 }], researchUploadOptions),
  )
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResearchDto: CreateResearchDto,
    @UploadedFiles() files: { pdf?: Express.Multer.File[] },
  ) {
    return this.researchService.update(id, updateResearchDto, files || {});
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.researchService.remove(+id);
  }

  @Patch(':id/views')
  async increaseViewCount(@Param('id') id: string) {
    return await this.researchService.increaseViewCount(+id);
  }
}
