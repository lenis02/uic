import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Network } from './entities/network.entity';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Network]), CloudinaryModule],
  controllers: [NetworkController],
  providers: [NetworkService],
})
export class NetworkModule {}
