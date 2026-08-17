import {
  Controller,
  Get,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JoinusService } from './joinus.service';
import { UpdateJoinFormDto } from './dto/update-join-form.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { joinFormUploadOptions } from '../common/utils/multer.options';

@Controller('joinus')
export class JoinusController {
  constructor(private readonly joinusService: JoinusService) {}

  @Get()
  findAll() {
    return this.joinusService.findAll();
  }

  @Patch(':type')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('file', joinFormUploadOptions))
  update(
    @Param('type') type: string,
    @Body() dto: UpdateJoinFormDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const validType = this.joinusService.assertValidType(type);
    return this.joinusService.update(validType, dto, file);
  }
}
