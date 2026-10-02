import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConversacionesService } from '../conversaciones/conversaciones.service';
import { CrearMensajeDto } from './dto/crear-mensaje.dto';
import { CrearCorreccionDto } from './dto/crear-correccion.dto';
import { Correccion, Mensaje } from './entities/mensaje.entity';
import { ServicioIdentidad } from '../servicio-identidad/servicio-identidad.service';

@Injectable()
export class MensajesService {
  constructor(
    private readonly conversacionesService: ConversacionesService,
    private readonly servicioIdentidad: ServicioIdentidad,
  ) {}

  async create(conversacionId: number, dto: CrearMensajeDto): Promise<Mensaje> {
    const conversacion = this.conversacionesService.findOne(conversacionId);
    this.conversacionesService.assertParticipant(conversacion, dto.autorId);
    this.conversacionesService.assertActive(conversacion);
    if (!dto.texto?.trim()) {
      throw new BadRequestException('El texto del mensaje no puede estar vacio');
    }
    await this.servicioIdentidad.verificarMensajeria(conversacion.iniciadorId, conversacion.destinatarioId);

    const mensaje = this.conversacionesService.nuevoMensaje(conversacion.id, dto.autorId, dto.texto);
    conversacion.mensajes.push(mensaje);
    return mensaje;
  }

  findForConversation(conversacionId: number, personaId: number): Mensaje[] {
    const conversacion = this.conversacionesService.findOne(conversacionId);
    this.conversacionesService.assertParticipant(conversacion, personaId);
    return [...conversacion.mensajes].sort((a, b) => a.enviadoEn.getTime() - b.enviadoEn.getTime());
  }

  markReceivedAsRead(conversacionId: number, personaId: number): { actualizados: number } {
    const conversacion = this.conversacionesService.findOne(conversacionId);
    this.conversacionesService.assertParticipant(conversacion, personaId);
    const mensajes = conversacion.mensajes.filter((mensaje) => mensaje.autorId !== personaId && !mensaje.leido);
    mensajes.forEach((mensaje) => (mensaje.leido = true));
    return { actualizados: mensajes.length };
  }

  unreadForPerson(personaId: number) {
    const resumen = this.conversacionesService.findForPerson(personaId).flatMap((conversacion) => {
      const cantidad = conversacion.mensajes.filter((mensaje) => mensaje.autorId !== personaId && !mensaje.leido).length;
      return cantidad ? [{ conversacionId: conversacion.id, cantidad }] : [];
    });
    return {
      personaId,
      total: resumen.reduce((total, item) => total + item.cantidad, 0),
      conversaciones: resumen,
    };
  }

  async correct(conversacionId: number, mensajeId: number, dto: CrearCorreccionDto): Promise<Mensaje> {
    const conversacion = this.conversacionesService.findOne(conversacionId);
    this.conversacionesService.assertParticipant(conversacion, dto.personaId);
    this.conversacionesService.assertActive(conversacion);
    const mensaje = conversacion.mensajes.find((item) => item.id === mensajeId);
    if (!mensaje) {
      throw new NotFoundException(`Mensaje ${mensajeId} no encontrado`);
    }
    if (mensaje.autorId === dto.personaId) {
      throw new BadRequestException('No se puede corregir un mensaje propio');
    }
    if (mensaje.correccion) {
      throw new ConflictException('El mensaje ya tiene una correccion');
    }
    if (!dto.textoCorregido?.trim()) {
      throw new BadRequestException('El texto corregido es obligatorio');
    }
    if (!(await this.servicioIdentidad.hablaIdioma(dto.personaId, conversacion.idioma))) {
      throw new BadRequestException('Solo puede corregir quien habla el idioma de la conversacion');
    }

    const correccion = new Correccion();
    correccion.personaId = dto.personaId;
    correccion.textoCorregido = dto.textoCorregido.trim();
    correccion.comentario = dto.comentario?.trim() || undefined;
    correccion.creadaEn = new Date();
    mensaje.correccion = correccion;
    return mensaje;
  }

}