import { Controller, Get, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { JoinusService } from './joinus.service';
import { UpdateJoinFormDto } from './dto/update-join-form.dto';
import { AdminGuard } from '../common/guards/admin.guard';

@Controller('joinus')
export class JoinusController {
  constructor(private readonly joinusService: JoinusService) {}

  @Get()
  findAll() {
    return this.joinusService.findAll();
  }

  @Patch(':type')
  @UseGuards(AdminGuard)
  update(@Param('type') type: string, @Body() dto: UpdateJoinFormDto) {
    const validType = this.joinusService.assertValidType(type);
    return this.joinusService.update(validType, dto);
  }
}
