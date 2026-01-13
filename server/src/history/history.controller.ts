// src/modules/history/history.controller.ts
import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}

  @Get() // 누구나 조회 가능
  findAll() {
    return this.historyService.findAll();
  }

  @Post() // 관리자만 등록 가능
  @UseGuards(AdminGuard)
  create(@Body() createHistoryDto: CreateHistoryDto) {
    return this.historyService.create(createHistoryDto);
  }

  @Delete(':id') // 관리자만 삭제 가능
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.historyService.remove(+id);
  }
}
