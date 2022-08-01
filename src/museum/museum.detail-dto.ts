/* eslint-disable prettier/prettier */
import { ArtworkDto } from "../artwork/artwork.dto";
import { ExhibitionDto } from "../exhibition/exhibition.dto";
import { MuseumDto } from "./museum.dto";

export class MuseumDetailDto extends MuseumDto {
  readonly exhibitions: ExhibitionDto[];
  readonly artworks: ArtworkDto[];
}
