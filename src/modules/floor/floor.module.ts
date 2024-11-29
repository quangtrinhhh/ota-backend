import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FloorController } from './floor.controller';
import { FloorService } from './floor.service';
import { FloorEntity } from 'src/entities/floor.entity';
import { UserEntity } from 'src/entities/user.entity';
import { RoomEntity } from 'src/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FloorEntity, UserEntity, RoomEntity])],
  controllers: [FloorController],
  providers: [FloorService],
  exports: [FloorService],
})
export class FloorModule {}
