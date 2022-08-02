import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtworkEntity } from '../artwork/artwork.entity';
import { MuseumEntity } from '../museum/museum.entity';
import { MuseumArtworkService } from './museum-artwork.service';

@Module({
  providers: [MuseumArtworkService],
  imports: [TypeOrmModule.forFeature([MuseumEntity, ArtworkEntity])],
})
export class MuseumArtworkModule {}
