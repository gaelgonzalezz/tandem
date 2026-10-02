import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDetalleDto } from './dto/create-detalle.dto';
import { UpdateDetalleDto } from './dto/update-detalle.dto';
import { Detalle } from './entities/detalle.entity';

@Injectable()
export class DetalleService {

  detalles: Detalle[] = [];

  create(createDetalleDto: CreateDetalleDto) {
    const newDetalle = new Detalle();

    newDetalle.id = Math.floor(Math.random() * 1000);
    newDetalle.nivel = createDetalleDto.nivel;

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
    return detalle;
  }

  remove(id: number) {
    this.detalles = this.detalles.filter((d) => d.id != id);
    return true;
  }
}
