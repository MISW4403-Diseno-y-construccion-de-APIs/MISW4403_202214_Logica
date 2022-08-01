/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MuseumEntity } from './museum.entity';
import { MuseumService } from './museum.service';

import { faker } from '@faker-js/faker';

describe('MuseumService', () => {
  let service: MuseumService;
  let repository: Repository<MuseumEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MuseumService],
    }).compile();

    service = module.get<MuseumService>(MuseumService);
    repository = module.get<Repository<MuseumEntity>>(getRepositoryToken(MuseumEntity));
    seedDatabase();
  });

  const seedDatabase = () => {
    repository.clear();
    for(let i = 0; i < 5; i++){
      repository.save({
        name: faker.company.companyName(), 
        description: faker.lorem.sentence(), 
        address: faker.address.secondaryAddress(), 
        city: faker.address.city(), 
        image: faker.image.imageUrl()})
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all museums', async () => {
    const museums = await service.findAll();
    expect(museums).not.toBeNull();
    expect(museums).toHaveLength(5);
  });
});
