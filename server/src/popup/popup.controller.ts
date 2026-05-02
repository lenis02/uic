import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PopupService } from './popup.service';
import { CreatePopupDto } from './dto/create-popup.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { imageUploadOptions } from '../common/utils/multer.options';

@Controller('popup')
export class PopupController {
  constructor(private readonly popupService: PopupService) {}

  @Get()
  findAll() {
    return this.popupService.findAll();
  }

  @Get('active')
  findActive() {
    return this.popupService.findActive();
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() dto: CreatePopupDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.popupService.create(dto, file);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id') id: string,
    @Body() dto: Partial<CreatePopupDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.popupService.update(+id, dto, file);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: string) {
    return this.popupService.remove(+id);
  }
}
