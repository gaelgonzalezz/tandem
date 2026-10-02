import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ConversacionesService } from './conversaciones.service';
import { CrearConversacionDto } from './dto/crear-conversacion.dto';
import { AccionConversacionDto } from './dto/accion-conversacion.dto';

@Controller('conversaciones')
export class ConversacionesController {
  constructor(private readonly conversacionesService: ConversacionesService) {}

  @Post()
  create(@Body() dto: CrearConversacionDto) {
    return this.conversacionesService.create(dto);
  }

  @Get('persona/:personaId')
  findForPerson(@Param('personaId', ParseIntPipe) personaId: number, @Query('estado') estado?: string) {
    return this.conversacionesService.findForPerson(personaId, estado);
  }

  @Post(':id/aceptar')
  accept(@Param('id', ParseIntPipe) id: number, @Body() dto: AccionConversacionDto) {
    return this.conversacionesService.accept(id, dto);
  }

  @Post(':id/rechazar')
  reject(@Param('id', ParseIntPipe) id: number, @Body() dto: AccionConversacionDto) {
    return this.conversacionesService.reject(id, dto);
  }

  @Post(':id/cerrar')
  close(@Param('id', ParseIntPipe) id: number, @Body() dto: AccionConversacionDto) {
    return this.conversacionesService.close(id, dto);
  }
}