/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkEntity } from '../artwork/artwork.entity';
import { Repository } from 'typeorm';
import { MuseumEntity } from '../museum/museum.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { MuseumArtworkService } from './museum-artwork.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('MuseumArtworkService', () => {
  let service: MuseumArtworkService;
  let museumRepository: Repository<MuseumEntity>;
  let artworkRepository: Repository<ArtworkEntity>;
  let museum: MuseumEntity;
  let artworksList : ArtworkEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [MuseumArtworkService],
    }).compile();

    service = module.get<MuseumArtworkService>(MuseumArtworkService);
    museumRepository = module.get<Repository<MuseumEntity>>(getRepositoryToken(MuseumEntity));
    artworkRepository = module.get<Repository<ArtworkEntity>>(getRepositoryToken(ArtworkEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    artworkRepository.clear();
    museumRepository.clear();

    artworksList = [];
    for(let i = 0; i < 5; i++){
        const artwork: ArtworkEntity = await artworkRepository.save({
          name: faker.company.companyName(), 
          year: parseInt(faker.random.numeric()),
          description: faker.lorem.sentence(),
          type: "Painting",
          mainImage: faker.image.imageUrl()
        })
        artworksList.push(artwork);
    }

    museum = await museumRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      address: faker.address.secondaryAddress(), 
      city: faker.address.city(), 
      image: faker.image.imageUrl(),
      artworks: artworksList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addArtworkMuseum should add an artwork to a museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    const newMuseum: MuseumEntity = await museumRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      address: faker.address.secondaryAddress(), 
      city: faker.address.city(), 
      image: faker.image.imageUrl()
    })

    const result: MuseumEntity = await service.addArtworkMuseum(newMuseum.id, newArtwork.id);
    
    expect(result.artworks.length).toBe(1);
    expect(result.artworks[0]).not.toBeNull();
    expect(result.artworks[0].name).toBe(newArtwork.name)
    expect(result.artworks[0].year).toBe(newArtwork.year)
    expect(result.artworks[0].description).toBe(newArtwork.description)
    expect(result.artworks[0].type).toBe(newArtwork.type)
    expect(result.artworks[0].mainImage).toBe(newArtwork.mainImage)
  });

  it('addArtworkMuseum should thrown exception for an invalid artwork', async () => {
    const newMuseum: MuseumEntity = await museumRepository.save({
      name: faker.company.companyName(), 
      description: faker.lorem.sentence(), 
      address: faker.address.secondaryAddress(), 
      city: faker.address.city(), 
      image: faker.image.imageUrl()
    })

    await expect(() => service.addArtworkMuseum(newMuseum.id, "0")).rejects.toHaveProperty("message", "The artwork with the given id was not found");
  });

  it('addArtworkMuseum should throw an exception for an invalid museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(() => service.addArtworkMuseum("0", newArtwork.id)).rejects.toHaveProperty("message", "The museum with the given id was not found");
  });

  it('findArtworkByMuseumIdArtworkId should return artwork by museum', async () => {
    const artwork: ArtworkEntity = artworksList[0];
    const storedArtwork: ArtworkEntity = await service.findArtworkByMuseumIdArtworkId(museum.id, artwork.id, )
    expect(storedArtwork).not.toBeNull();
    expect(storedArtwork.name).toBe(artwork.name);
    expect(storedArtwork.year).toBe(artwork.year);
    expect(storedArtwork.description).toBe(artwork.description);
    expect(storedArtwork.type).toBe(artwork.type);
    expect(storedArtwork.mainImage).toBe(artwork.mainImage);
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an invalid artwork', async () => {
    await expect(()=> service.findArtworkByMuseumIdArtworkId(museum.id, "0")).rejects.toHaveProperty("message", "The artwork with the given id was not found"); 
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an invalid museum', async () => {
    const artwork: ArtworkEntity = artworksList[0]; 
    await expect(()=> service.findArtworkByMuseumIdArtworkId("0", artwork.id)).rejects.toHaveProperty("message", "The museum with the given id was not found"); 
  });

  it('findArtworkByMuseumIdArtworkId should throw an exception for an artwork not associated to the museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.findArtworkByMuseumIdArtworkId(museum.id, newArtwork.id)).rejects.toHaveProperty("message", "The artwork with the given id is not associated to the museum"); 
  });

  it('findArtworksByMuseumId should return artworks by museum', async ()=>{
    const artworks: ArtworkEntity[] = await service.findArtworksByMuseumId(museum.id);
    expect(artworks.length).toBe(5)
  });

  it('findArtworksByMuseumId should throw an exception for an invalid museum', async () => {
    await expect(()=> service.findArtworksByMuseumId("0")).rejects.toHaveProperty("message", "The museum with the given id was not found"); 
  });

  it('associateArtworksMuseum should update artworks list for a museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl() 
    });

    const updatedMuseum: MuseumEntity = await service.associateArtworksMuseum(museum.id, [newArtwork]);
    expect(updatedMuseum.artworks.length).toBe(1);

    expect(updatedMuseum.artworks[0].name).toBe(newArtwork.name);
    expect(updatedMuseum.artworks[0].year).toBe(newArtwork.year);
    expect(updatedMuseum.artworks[0].description).toBe(newArtwork.description);
    expect(updatedMuseum.artworks[0].type).toBe(newArtwork.type);
    expect(updatedMuseum.artworks[0].mainImage).toBe(newArtwork.mainImage);
  });

  it('associateArtworksMuseum should throw an exception for an invalid museum', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.associateArtworksMuseum("0", [newArtwork])).rejects.toHaveProperty("message", "The museum with the given id was not found"); 
  });

  it('associateArtworksMuseum should throw an exception for an invalid artwork', async () => {
    const newArtwork: ArtworkEntity = artworksList[0];
    newArtwork.id = "0";

    await expect(()=> service.associateArtworksMuseum(museum.id, [newArtwork])).rejects.toHaveProperty("message", "The artwork with the given id was not found"); 
  });

  it('deleteArtworkToMuseum should remove an artwork from a museum', async () => {
    const artwork: ArtworkEntity = artworksList[0];
    
    await service.deleteArtworkMuseum(museum.id, artwork.id);

    const storedMuseum: MuseumEntity = await museumRepository.findOne({where: {id: museum.id}, relations: ["artworks"]});
    const deletedArtwork: ArtworkEntity = storedMuseum.artworks.find(a => a.id === artwork.id);

    expect(deletedArtwork).toBeUndefined();

  });

  it('deleteArtworkToMuseum should thrown an exception for an invalid artwork', async () => {
    await expect(()=> service.deleteArtworkMuseum(museum.id, "0")).rejects.toHaveProperty("message", "The artwork with the given id was not found"); 
  });

  it('deleteArtworkToMuseum should thrown an exception for an invalid museum', async () => {
    const artwork: ArtworkEntity = artworksList[0];
    await expect(()=> service.deleteArtworkMuseum("0", artwork.id)).rejects.toHaveProperty("message", "The museum with the given id was not found"); 
  });

  it('deleteArtworkToMuseum should thrown an exception for an non asocciated artwork', async () => {
    const newArtwork: ArtworkEntity = await artworkRepository.save({
      name: faker.company.companyName(), 
      year: parseInt(faker.random.numeric()),
      description: faker.lorem.sentence(),
      type: "Painting",
      mainImage: faker.image.imageUrl()
    });

    await expect(()=> service.deleteArtworkMuseum(museum.id, newArtwork.id)).rejects.toHaveProperty("message", "The artwork with the given id is not associated to the museum"); 
  }); 

});
