import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePreferenciaDto } from './dto/create-preferencia.dto';
import { UpdatePreferenciaDto } from './dto/update-preferencia.dto';
import { Preferencia } from './entities/preferencia.entity';
import { PersonaService } from '../persona/persona.service';

@Injectable()
export class PreferenciaService {

  constructor(private readonly personaService: PersonaService) {}

  preferencias: Preferencia[] = [];

  create(createPreferenciaDto: CreatePreferenciaDto) {
    const newPreferencia = new Preferencia();

    const persona = this.personaService.findOne(createPreferenciaDto.personaId);
    if (!persona) {
      throw new NotFoundException(`Persona with id ${createPreferenciaDto.personaId} not found`);
    }

    newPreferencia.id = Math.floor(Math.random() * 1000);
    newPreferencia.persona = persona;
    newPreferencia.permisoConversacion = createPreferenciaDto.permisoConversacion;
    newPreferencia.conversacionesActivasPermitidas = createPreferenciaDto.conversacionesActivasPermitidas;
    newPreferencia.noMolestar = createPreferenciaDto.noMolestar;
    newPreferencia.bloqueados = createPreferenciaDto.bloqueados;

    this.preferencias.push(newPreferencia);
    return newPreferencia;
  }

  findAll() {
    return this.preferencias;
  }

  findOne(id: number) {
    return this.preferencias.find(preferencia => preferencia.id === id);
  }

  update(id: number, updatePreferenciaDto: UpdatePreferenciaDto) {
    const preferencia = this.preferencias.find(p => p.id === id);
    if (!preferencia) {
      throw new NotFoundException(`Preferencia with id ${id} not found`);
    }
    
    if(updatePreferenciaDto.permisoConversacion){
      preferencia.permisoConversacion = updatePreferenciaDto.permisoConversacion;
    }
    if(updatePreferenciaDto.conversacionesActivasPermitidas !== undefined){
      preferencia.conversacionesActivasPermitidas = updatePreferenciaDto.conversacionesActivasPermitidas;
    }
    if(updatePreferenciaDto.noMolestar){
      preferencia.noMolestar = updatePreferenciaDto.noMolestar;
    }
    if(updatePreferenciaDto.bloqueados){
      preferencia.bloqueados = updatePreferenciaDto.bloqueados;
    }
  }

  remove(id: number) {
    this.preferencias = this.preferencias.filter((p) => p.id != id);
    return true;
  }
}
