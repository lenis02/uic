import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ActivityService } from './activity.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { ReorderActivityDto } from './dto/reorder-activity.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { imageUploadOptions } from '../common/utils/multer.options';

@Controller('activity')
export class ActivityController {
  constructor(private readonly activityService: ActivityService) {}

  @Get()
  findAll() {
    return this.activityService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() dto: CreateActivityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.activityService.create(dto, file);
  }

  // ':id'보다 먼저 선언해야 'reorder'가 id로 잡히지 않는다.
  @Patch('reorder')
  @UseGuards(AdminGuard)
  reorder(@Body() dto: ReorderActivityDto) {
    return this.activityService.reorder(dto.ids);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateActivityDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.activityService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.activityService.remove(id);
  }
}
