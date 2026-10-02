import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DetalleService } from './detalle.service';
import { CreateDetalleDto } from './dto/create-detalle.dto';
import { UpdateDetalleDto } from './dto/update-detalle.dto';

@Controller('detalle')
export class DetalleController {
  constructor(private readonly detalleService: DetalleService) {}

  @Post()
  create(@Body() createDetalleDto: CreateDetalleDto) {
    return this.detalleService.create(createDetalleDto);
  }

  @Get()
  findAll() {
    return this.detalleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDetalleDto: UpdateDetalleDto) {
    return this.detalleService.update(+id, updateDetalleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleService.remove(+id);
  }
}
