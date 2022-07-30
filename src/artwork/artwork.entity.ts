/* eslint-disable prettier/prettier */
import { ExhibitionEntity } from "../exhibition/exhibition.entity";
import { MuseumEntity } from "../museum/museum.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ImageEntity } from "../image/image.entity";
import { ArtistEntity } from "../artist/artist.entity";

@Entity()
export class ArtworkEntity {

    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    name: string;
 
    @Column()
    year: number;
 
    @Column()
    description: string;
 
    @Column()
    type: string;
 
    @Column()
    mainImage: string;

    @ManyToOne(() => MuseumEntity, museum => museum.artworks)
    museum: MuseumEntity;

    @ManyToOne(() => ExhibitionEntity, exhibition => exhibition.artworks)
    exhibition: ExhibitionEntity;

    @OneToMany(() => ImageEntity, image => image.artwork)
    images: ImageEntity[];

    @ManyToOne(() => ArtistEntity, artist => artist.artworks)
    artist: ArtistEntity;
}

