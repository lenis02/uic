import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { CreateUploadSignatureDto } from './dto/create-upload-signature.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly uploadsService: UploadsService) {}

  @Post('signature')
  @ApiBearerAuth()
  @UseGuards(AdminGuard)
  createSignature(@Body() dto: CreateUploadSignatureDto) {
    return this.uploadsService.createSignature(dto.kind);
  }
}
