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
import { AdvertisementService } from './advertisement.service';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { UpdateAdPlacementDto } from './dto/update-ad-placement.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { imageUploadOptions } from '../common/utils/multer.options';

@Controller('advertisement')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  // 공개 화면용. 활성화된 광고만 내려준다.
  @Get()
  findActive() {
    return this.advertisementService.findGrouped(true);
  }

  // 관리자 화면용. 비활성 광고까지 포함한다. ':id'가 없는 GET이라 순서 무관.
  @Get('admin')
  @UseGuards(AdminGuard)
  findAll() {
    return this.advertisementService.findGrouped(false);
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  create(
    @Body() dto: CreateAdvertisementDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.advertisementService.create(dto, file);
  }

  // ':id'보다 먼저 선언해야 'placement'가 id로 잡히지 않는다.
  @Patch('placement/:placement')
  @UseGuards(AdminGuard)
  updatePlacement(
    @Param('placement') placement: string,
    @Body() dto: UpdateAdPlacementDto,
  ) {
    const valid = this.advertisementService.assertValidPlacement(placement);
    return this.advertisementService.updatePlacement(valid, dto.barHeight);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image', imageUploadOptions))
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAdvertisementDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.advertisementService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.advertisementService.remove(id);
  }
}
