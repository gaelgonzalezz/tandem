import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { PaisService } from '../pais/pais.service';

@Injectable()
export class PersonaService {
  constructor(private readonly paisService: PaisService) {}

  personas: Persona[] = [];

  create(createPersonaDto: CreatePersonaDto) {
    const newPersona = new Persona();

    const paisResidencia = this.paisService.findOne(createPersonaDto.paisResidencia.id);
    const idiomasHabla = createPersonaDto.idiomasHabla.map((idioma) => idioma.id);
    const idiomasHablaNivel = createPersonaDto.idiomasHablaNivel.map((nivel) => nivel);
    const idiomasAprende = createPersonaDto.idiomasAprende.map((idioma) => idioma.id);
    const idiomasAprendeNivel = createPersonaDto.idiomasAprendeNivel.map((nivel) => nivel);

    newPersona.id = Math.floor(Math.random() * 1000);
    newPersona.nombre = createPersonaDto.nombre;
    newPersona.apellido = createPersonaDto.apellido;
    newPersona.alias = createPersonaDto.alias;
    newPersona.email = createPersonaDto.email;
    newPersona.paisResidencia = paisResidencia;
    newPersona.estado = createPersonaDto.estado;
    newPersona.idiomasHabla = idiomasHabla;
    newPersona.idiomasHablaNivel = idiomasHablaNivel;
    newPersona.idiomasAprende = idiomasAprende;
    newPersona.idiomasAprendeNivel = idiomasAprendeNivel;

    this.personas.push(newPersona);

    return newPersona.id;
  }

  findAll() {
    return this.personas;
  }

  findOne(id: number) {
    return this.personas.find(p => p.id === id);
  }

  update(id: number, updatePersonaDto: UpdatePersonaDto) {
    const persona = this.personas.find((p) => p.id == id)
    if(!persona){
      throw new NotFoundException();
    }

    if(updatePersonaDto.nombre){
      persona.nombre = updatePersonaDto.nombre;
    }
    
    if(updatePersonaDto.apellido){
      persona.apellido = updatePersonaDto.apellido;
    }
    
    if(updatePersonaDto.alias){
      persona.alias = updatePersonaDto.alias;
    }

    if(updatePersonaDto.email){
      persona.email = updatePersonaDto.email;
    }

    if(updatePersonaDto.paisResidencia){
      persona.paisResidencia = updatePersonaDto.paisResidencia;
    }

    if(updatePersonaDto.estado !== undefined){
      persona.estado = updatePersonaDto.estado;
    }

    if(updatePersonaDto.idiomasHabla){
      persona.idiomasHabla = updatePersonaDto.idiomasHabla;
    }

    if(updatePersonaDto.idiomasAprende){
      persona.idiomasAprende = updatePersonaDto.idiomasAprende;
    }
  }

  remove(id: number) {
    this.personas = this.personas.filter((p) => p.id != id);
    return true;
  }
}
