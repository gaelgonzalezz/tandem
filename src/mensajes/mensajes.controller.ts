import { Body, Controller, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { CrearCorreccionDto } from './dto/crear-correccion.dto';
import { CrearMensajeDto } from './dto/crear-mensaje.dto';
import { MarcarLeidosDto } from './dto/marcar-leidos.dto';
import { MensajesService } from './mensajes.service';

@Controller()
export class MensajesController {
  constructor(private readonly mensajesService: MensajesService) {}

  @Post('conversaciones/:id/mensajes')
  create(@Param('id', ParseIntPipe) id: number, @Body() dto: CrearMensajeDto) {
    return this.mensajesService.create(id, dto);
  }

  @Get('conversaciones/:id/mensajes')
  findForConversation(
    @Param('id', ParseIntPipe) id: number,
    @Query('personaId', ParseIntPipe) personaId: number,
  ) {
    return this.mensajesService.findForConversation(id, personaId);
  }

  @Post('conversaciones/:id/mensajes/:mensajeId/correcciones')
  correct(
    @Param('id', ParseIntPipe) id: number,
    @Param('mensajeId', ParseIntPipe) mensajeId: number,
    @Body() dto: CrearCorreccionDto,
  ) {
    return this.mensajesService.correct(id, mensajeId, dto);
  }

  @Post('conversaciones/:id/leidos')
  markReceivedAsRead(@Param('id', ParseIntPipe) id: number, @Body() dto: MarcarLeidosDto) {
    return this.mensajesService.markReceivedAsRead(id, dto.personaId);
  }

  @Get('mensajes/no-leidos/:personaId')
  unreadForPerson(@Param('personaId', ParseIntPipe) personaId: number) {
    return this.mensajesService.unreadForPerson(personaId);
  }
}