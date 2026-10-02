import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePaisDto } from './dto/create-pais.dto';
import { UpdatePaisDto } from './dto/update-pais.dto';
import { Pais } from './entities/pais.entity';

@Injectable()
export class PaisService {

  paises: Pais[] = [];

  create(createPaisDto: CreatePaisDto) {
    const newPais = new Pais();

    newPais.id = Math.floor(Math.random() * 1000);
    newPais.nombre = createPaisDto.nombre;

    this.paises.push(newPais);

    return newPais.id;
  }

  findAll() {
    return this.paises;
  }

  findOne(id: number) {
    return this.paises.find(p => p.id === id);
  }

  update(id: number, updatePaisDto: UpdatePaisDto) {
    const pais = this.paises.find(p => p.id === id);
    if (!pais) {
      throw new NotFoundException();
    }
    Object.assign(pais, updatePaisDto);
    return pais;
  }

  remove(id: number) {
    this.paises = this.paises.filter((p) => p.id != id);
    return true;
  }
}
