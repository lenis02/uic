import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Activity]), CloudinaryModule],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
