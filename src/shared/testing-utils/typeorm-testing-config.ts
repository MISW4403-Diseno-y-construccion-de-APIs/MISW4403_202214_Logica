/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { ArtistEntity } from '../../artist/artist.entity';
import { ArtworkEntity } from '../../artwork/artwork.entity';
import { ExhibitionEntity } from '../../exhibition/exhibition.entity';
import { ImageEntity } from '../../image/image.entity';
import { MovementEntity } from '../../movement/movement.entity';
import { MuseumEntity } from '../../museum/museum.entity';
import { SponsorEntity } from '../../sponsor/sponsor.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [ArtistEntity, ArtworkEntity, ExhibitionEntity, ImageEntity, MovementEntity, MuseumEntity, SponsorEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([ArtistEntity, ArtworkEntity, ExhibitionEntity, ImageEntity, MovementEntity, MuseumEntity, SponsorEntity]),
];
