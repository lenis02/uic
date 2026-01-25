import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GreetingService } from './greeting.service';
import { CreateGreetingDto } from './dto/create-greeting.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('greeting')
export class GreetingController {
  constructor(private readonly greetingService: GreetingService) {}

  @Get()
  findAll() {
    return this.greetingService.findAll();
  }

  @Get(':role')
  async findOne(@Param('role') role: string) {
    return await this.greetingService.findOne(role);
  }

  // 초기 생성용
  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image')) // 로컬 저장 옵션 제거
  async create(
    @Body() dto: CreateGreetingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // 파일 객체를 서비스로 전달 (서비스가 업로드 처리)
    return await this.greetingService.createOrUpdate(dto, file);
  }

  // 수정용
  @Patch(':role')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image')) // 로컬 저장 옵션 제거
  async update(
    @Param('role') role: string,
    @Body() dto: CreateGreetingDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    // role을 DTO에 합쳐서 서비스로 전달
    return await this.greetingService.createOrUpdate({ ...dto, role }, file);
  }
}
