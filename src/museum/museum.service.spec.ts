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
  let museumsList: MuseumEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MuseumService],
    }).compile();

    service = module.get<MuseumService>(MuseumService);
    repository = module.get<Repository<MuseumEntity>>(getRepositoryToken(MuseumEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    museumsList = [];
    for(let i = 0; i < 5; i++){
        const museum = await repository.save({
        name: faker.company.companyName(), 
        description: faker.lorem.sentence(), 
        address: faker.address.secondaryAddress(), 
        city: faker.address.city(), 
        image: faker.image.imageUrl()})
        museumsList.push(museum);
    }
  }
    
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all museums', async () => {
    const museums = await service.findAll();
    expect(museums).not.toBeNull();
    expect(museums).toHaveLength(museumsList.length);
  });

  it('findOne should one museum by id', async () => {
    const storedMuseum = museumsList[0];
    const museum = await service.findOne(storedMuseum.id)
    expect(museum).not.toBeNull();
    expect(museum.name).toEqual(storedMuseum.name)
    expect(museum.description).toEqual(storedMuseum.description)
    expect(museum.address).toEqual(storedMuseum.address)
    expect(museum.city).toEqual(storedMuseum.city)
    expect(museum.image).toEqual(storedMuseum.image)
  });

  it('findOne should return exception when get an invalid museum', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "The museum with the given id was not found")
  });

  it('create should return a new museum', async () => {
    const museum = {
      id: "",
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      address: faker.address.secondaryAddress(), 
      city: faker.address.city(), 
      image: faker.image.imageUrl()
    }

    const newMuseum = await service.create(museum);
    expect(newMuseum).not.toBeNull();

    const storedMuseum = await repository.findOne({where: {id: newMuseum.id}})
    expect(storedMuseum).not.toBeNull();
    expect(storedMuseum.name).toEqual(newMuseum.name)
    expect(storedMuseum.description).toEqual(newMuseum.description)
    expect(storedMuseum.address).toEqual(newMuseum.address)
    expect(storedMuseum.city).toEqual(newMuseum.city)
    expect(storedMuseum.image).toEqual(newMuseum.image)
  });

});
