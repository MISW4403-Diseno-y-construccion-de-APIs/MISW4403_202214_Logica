/* eslint-disable prettier/prettier */
import { ArtworkEntity } from "../artwork/artwork.entity";
import { MuseumEntity } from "../museum/museum.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { SponsorEntity } from "../sponsor/sponsor.entity";

@Entity()
export class ExhibitionEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    name: string;
 
    @Column()
    description: string;
 
    @ManyToOne(() => MuseumEntity, museum => museum.exhibitions)
    museum: MuseumEntity;
 
    @OneToMany(() => ArtworkEntity, artwork => artwork.exhibition)
    artworks: ArtworkEntity[];

    @OneToOne(() => SponsorEntity, sponsor => sponsor.exhibition)
    @JoinColumn()
    sponsor: SponsorEntity;
}
