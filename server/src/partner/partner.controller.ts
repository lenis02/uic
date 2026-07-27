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
import { PartnerService } from './partner.service';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { imageUploadOptions } from '../common/utils/multer.options';

@Controller('partner')
export class PartnerController {
  constructor(private readonly partnerService: PartnerService) {}

  @Get()
  findAll() {
    return this.partnerService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('logo', imageUploadOptions))
  create(
    @Body() dto: CreatePartnerDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.partnerService.create(dto, file);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('logo', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreatePartnerDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.partnerService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.partnerService.remove(id);
  }
}
