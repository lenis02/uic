import {
  Controller,
  Post,
  Patch,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ResearchService } from './research.service';
import { CreateResearchDto } from './dto/create-research.dto';
import { UpdateResearchDto } from './dto/update-research.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('research')
export class ResearchController {
  constructor(private readonly researchService: ResearchService) {}

  @Get()
  findAll() {
    return this.researchService.findAll();
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async create(@Body() createResearchDto: CreateResearchDto) {
    return this.researchService.create(createResearchDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateResearchDto: UpdateResearchDto,
  ) {
    return this.researchService.update(id, updateResearchDto);
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
