import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Popup } from './entities/popup.entity';
import { PopupService } from './popup.service';
import { PopupController } from './popup.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Popup]), CloudinaryModule],
  controllers: [PopupController],
  providers: [PopupService],
})
export class PopupModule {}
