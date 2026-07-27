import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { PartnerService } from './partner.service';
import { PartnerController } from './partner.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Partner]), CloudinaryModule],
  controllers: [PartnerController],
  providers: [PartnerService],
})
export class PartnerModule {}
