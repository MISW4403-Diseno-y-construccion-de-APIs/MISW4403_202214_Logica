/* eslint-disable prettier/prettier */
import { ArtistEntity } from "../artist/artist.entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MovementEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    name: string;
 
    @Column()
    description: string;
   
    @Column()
    countryOfOrigin: string;

    @ManyToMany(() => ArtistEntity, artist => artist.movements)
    @JoinTable()
    artists: ArtistEntity[];
}
