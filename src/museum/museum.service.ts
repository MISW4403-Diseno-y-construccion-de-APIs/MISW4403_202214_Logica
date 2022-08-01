/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { MuseumEntity } from './museum.entity';
import { MuseumDto } from './museum.dto';

@Injectable()
export class MuseumService {
    constructor(
        @InjectRepository(MuseumEntity)
        private readonly museumRepository: Repository<MuseumEntity>
    ){}

    async findAll(): Promise<MuseumEntity[]> {
        return await this.museumRepository.find({ relations: ["artworks", "exhibitions"] });
    }

    async findOne(id: string): Promise<MuseumEntity> {
        const museum = await this.museumRepository.findOne({where: {id}, relations: ["artworks", "exhibitions"] } )
        if (!museum)
          throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND)
        else
          return museum;
    }
    
    async create(museumDto: MuseumDto): Promise<MuseumEntity> {
        const museum = new MuseumEntity();
        museum.name = museumDto.name;
        museum.description = museumDto.description;
        museum.address = museumDto.address;
        museum.city = museumDto.city;
        museum.image = museumDto.image;
        return await this.museumRepository.save(museum);
    }

    async update(id: string, museumDto: MuseumDto): Promise<MuseumEntity> {
        const museum = await this.museumRepository.findOne({where:{id}});
        if (!museum)
          throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND)
       
        museum.name = museumDto.name;
        museum.description = museumDto.description;
        museum.address = museumDto.address;
        museum.city = museumDto.city;
        museum.image = museumDto.image;
     
        await this.museumRepository.save(museum);
        return museum;
    }

    async delete(id: string) {
        const museum = await this.museumRepository.findOne({where:{id}});
        if (!museum)
          throw new BusinessLogicException("The museum with the given id was not found", BusinessError.NOT_FOUND)
      
        await this.museumRepository.remove(museum);
    }
}
