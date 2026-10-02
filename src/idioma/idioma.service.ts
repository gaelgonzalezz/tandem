import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIdiomaDto } from './dto/create-idioma.dto';
import { Idioma } from './entities/idioma.entity';

@Injectable()
export class IdiomaService {
  
  idiomas: Idioma[] = [];

  create(createIdiomaDto: CreateIdiomaDto) {
    const newIdioma = new Idioma();

    newIdioma.id = Math.floor(Math.random() * 1000);
    newIdioma.nombre = createIdiomaDto.nombre;
    newIdioma.alias = createIdiomaDto.alias;

    this.idiomas.push(newIdioma);
    
    return newIdioma.id;
  }

  findAll() {
    return this.idiomas;
  }

  findOne(id: number) {
    return this.idiomas.find(i => i.id === id);
  }
  
  remove(id: number) {
    this.idiomas = this.idiomas.filter((i) => i.id != id);
    return true;
  }
}
