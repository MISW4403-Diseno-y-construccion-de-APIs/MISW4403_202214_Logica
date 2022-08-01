import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MuseumEntity } from './museum.entity';
import { MuseumService } from './museum.service';

@Module({
  imports: [TypeOrmModule.forFeature([MuseumEntity])],
  providers: [MuseumService],
})
export class MuseumModule {}
