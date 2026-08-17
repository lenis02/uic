import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinForm } from './entities/join-form.entity';
import { JoinusService } from './joinus.service';
import { JoinusController } from './joinus.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([JoinForm]), CloudinaryModule],
  controllers: [JoinusController],
  providers: [JoinusService],
})
export class JoinusModule {}
