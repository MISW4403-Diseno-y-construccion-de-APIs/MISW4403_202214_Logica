/* eslint-disable prettier/prettier */
import { ExhibitionEntity } from "../exhibition/exhibition.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class SponsorEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;
 
    @Column()
    name: string;
 
    @Column()
    description: string;
 
    @Column()
    website: string;

    @OneToOne(() => ExhibitionEntity, exhibition => exhibition.sponsor)
    exhibition: ExhibitionEntity;

}
