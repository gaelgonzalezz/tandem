import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePersonaDto } from './dto/create-persona.dto';
import { UpdatePersonaDto } from './dto/update-persona.dto';
import { Persona } from './entities/persona.entity';
import { PaisService } from '../pais/pais.service';
import { IdiomaService } from '../idioma/idioma.service';
import { DetalleService } from '../detalle/detalle.service';

@Injectable()
export class PersonaService {
  constructor(private readonly paisService: PaisService, private readonly idiomaService: IdiomaService, private readonly detalleService: DetalleService) {}

  personas: Persona[] = [];

  create(createPersonaDto: CreatePersonaDto) {
    const newPersona = new Persona();

    const paisResidencia = this.paisService.findOne(createPersonaDto.paisResidencia);
    const idiomasHabla = createPersonaDto.idiomasHabla.map((idiomaId) => this.idiomaService.findOne(idiomaId));
    const idiomasHablaNivel = createPersonaDto.idiomasHablaNivel.map((detalleId) => this.detalleService.findOne(detalleId));
    const idiomasAprende = createPersonaDto.idiomasAprende.map((idiomaId) => this.idiomaService.findOne(idiomaId));
    const idiomasAprendeNivel = createPersonaDto.idiomasAprendeNivel.map((detalleId) => this.detalleService.findOne(detalleId));

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
      const paisResidencia = this.paisService.findOne(updatePersonaDto.paisResidencia);
      persona.paisResidencia = paisResidencia;
    }

    if(updatePersonaDto.estado !== undefined){
      persona.estado = updatePersonaDto.estado;
    }

    if(updatePersonaDto.idiomasHabla){
      const idiomasHabla = updatePersonaDto.idiomasHabla.map((idiomaId) => this.idiomaService.findOne(idiomaId));
      persona.idiomasHabla = idiomasHabla;
    }

    if(updatePersonaDto.idiomasHablaNivel){
      const idiomasHablaNivel = updatePersonaDto.idiomasHablaNivel.map((detalleId) => this.detalleService.findOne(detalleId));
      persona.idiomasHablaNivel = idiomasHablaNivel;
    }

    if(updatePersonaDto.idiomasAprende){ 
      persona.idiomasAprende = updatePersonaDto.idiomasAprende.map((idiomaId) => this.idiomaService.findOne(idiomaId));
    }

    if(updatePersonaDto.idiomasAprendeNivel){
      const idiomasAprendeNivel = updatePersonaDto.idiomasAprendeNivel.map((detalleId) => this.detalleService.findOne(detalleId));
      persona.idiomasAprendeNivel = idiomasAprendeNivel;
    }
  }

  remove(id: number) {
    this.personas = this.personas.filter((p) => p.id != id);
    return true;
  }
}
