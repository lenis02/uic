import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JoinForm } from './entities/join-form.entity';
import { JoinusService } from './joinus.service';
import { JoinusController } from './joinus.controller';

@Module({
  imports: [TypeOrmModule.forFeature([JoinForm])],
  controllers: [JoinusController],
  providers: [JoinusService],
})
export class JoinusModule {}
