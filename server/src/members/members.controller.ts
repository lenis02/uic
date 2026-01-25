import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { MembersService } from './members.service';
import { CreateMemberDto } from './dto/create-member.dto';
import { AdminGuard } from '../common/guards/admin.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get()
  findAll(@Query('gen') gen?: string) {
    if (gen) return this.membersService.findByGeneration(+gen);
    return this.membersService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image')) // 로컬 multerOptions 제거
  create(
    @Body() dto: CreateMemberDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.membersService.create(dto, file);
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  @UseInterceptors(FileInterceptor('image')) // 로컬 multerOptions 제거
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: Partial<CreateMemberDto>,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.membersService.update(id, dto, file);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.membersService.remove(id);
  }

  @Post('next-gen')
  @UseGuards(AdminGuard)
  async createNextGen() {
    return await this.membersService.createNextGeneration();
  }
}
