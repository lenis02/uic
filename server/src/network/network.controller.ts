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
import { NetworkService } from './network.service';
import { CreateNetworkDto } from './dto/create-network.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { imageUploadOptions } from '../common/utils/multer.options';

@Controller('network')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Get()
  findAll() {
    return this.networkService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('logo', imageUploadOptions))
  create(
    @Body() dto: CreateNetworkDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.networkService.create(dto, file);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('logo', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateNetworkDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.networkService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.networkService.remove(id);
  }
}
