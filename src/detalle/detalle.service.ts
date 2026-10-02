import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleDto } from './dto/create-detalle.dto';
import { UpdateDetalleDto } from './dto/update-detalle.dto';
import { Detalle } from './entities/detalle.entity';
import { PersonaService } from '../persona/persona.service';
import { IdiomaService } from '../idioma/idioma.service';

@Injectable()
export class DetalleService {
  constructor(
    @Inject(forwardRef(() => PersonaService))
    private readonly personaService: PersonaService,
    private readonly idiomaService: IdiomaService,
  ) {}

  detalles: Detalle[] = [];

  create(createDetalleDto: CreateDetalleDto) {
    const newDetalle = new Detalle();
    const personaId = this.personaService.findOne(createDetalleDto.personaId);
    const idiomaId = this.idiomaService.findOne(createDetalleDto.idiomaId);

    newDetalle.id = Math.floor(Math.random() * 1000);
    newDetalle.nivel = createDetalleDto.nivel;
    newDetalle.persona = personaId;
    newDetalle.idioma = idiomaId;

    this.detalles.push(newDetalle);

    return newDetalle;
  }

  findAll() {
    return this.detalles;
  }

  findOne(id: number) {
    return this.detalles.find((d) => d.id === id);
  }

  update(id: number, updateDetalleDto: UpdateDetalleDto) {
    const detalle = this.detalles.find((d) => d.id === id);
    if (!detalle) {
      throw new NotFoundException(`Detalle with id ${id} not found`);
    }

    if (updateDetalleDto.nivel) {
      detalle.nivel = updateDetalleDto.nivel;
    }
    
    if (updateDetalleDto.personaId) {
      const personaId = this.personaService.findOne(updateDetalleDto.personaId);
      detalle.persona = personaId;
    }

    if (updateDetalleDto.idiomaId) {
      const idiomaId = this.idiomaService.findOne(updateDetalleDto.idiomaId);
      detalle.idioma = idiomaId;
    }
  }

  remove(id: number) {
    this.detalles = this.detalles.filter((d) => d.id != id);
    return true;
  }
}
