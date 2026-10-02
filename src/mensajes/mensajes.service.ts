import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConversacionesService } from '../conversaciones/conversaciones.service';
import { ServicioIdentidad } from '../servicio-identidad/servicio-identidad.service';
import { EstadoConversacion } from '../conversaciones/entities/conversacion.entity';
import { CrearCorreccionDto } from './dto/crear-correccion.dto';
import { CrearMensajeDto } from './dto/crear-mensaje.dto';
import { Correccion, Mensaje } from './entities/mensaje.entity';

@Injectable()
export class MensajesService {
  constructor(
    private readonly conversacionesService: ConversacionesService,
    private readonly servicioIdentidad: ServicioIdentidad,
  ) {}

  async create(conversacionId: number, dto: CrearMensajeDto): Promise<Mensaje> {
    this.assertId(dto.autorId, 'autorId');
    const conversacion = this.conversacionesService.findOne(conversacionId);
    this.conversacionesService.assertParticipant(conversacion, dto.autorId);
    this.conversacionesService.assertActive(conversacion);
    if (!dto.texto?.trim()) throw new BadRequestException('El texto del mensaje no puede estar vacio');

    await this.servicioIdentidad.validarEnvio(conversacion.iniciadorId, conversacion.destinatarioId);
    const mensaje = this.conversacionesService.nuevoMensaje(conversacion.id, dto.autorId, dto.texto);
    conversacion.mensajes.push(mensaje);
    return mensaje;
  }

  findForConversation(conversacionId: number, personaId: number): Mensaje[] {
    this.assertId(personaId, 'personaId');
    const conversacion = this.conversacionesService.findOne(conversacionId);
    this.conversacionesService.assertParticipant(conversacion, personaId);
    this.assertNotFinished(conversacion.estado);
    return [...conversacion.mensajes].sort((a, b) => a.enviadoEn.getTime() - b.enviadoEn.getTime());
  }

  markReceivedAsRead(conversacionId: number, personaId: number): { actualizados: number } {
    this.assertId(personaId, 'personaId');
    const conversacion = this.conversacionesService.findOne(conversacionId);
    this.conversacionesService.assertParticipant(conversacion, personaId);
    this.assertNotFinished(conversacion.estado);
    const recibidos = conversacion.mensajes.filter((mensaje) => mensaje.autorId !== personaId && !mensaje.leido);
    recibidos.forEach((mensaje) => (mensaje.leido = true));
    return { actualizados: recibidos.length };
  }

  unreadForPerson(personaId: number) {
    this.assertId(personaId, 'personaId');
    const conversaciones = this.conversacionesService.findForPerson(personaId)
      .filter((conversacion) => [EstadoConversacion.PENDIENTE, EstadoConversacion.ACTIVA].includes(conversacion.estado))
      .map((conversacion) => ({
      conversacionId: conversacion.id,
      cantidad: conversacion.mensajes.filter((mensaje) => mensaje.autorId !== personaId && !mensaje.leido).length,
    })).filter((item) => item.cantidad > 0);
    return {
      personaId,
      total: conversaciones.reduce((total, item) => total + item.cantidad, 0),
      conversaciones,
    };
  }

  async correct(conversacionId: number, mensajeId: number, dto: CrearCorreccionDto): Promise<Mensaje> {
    this.assertId(dto.personaId, 'personaId');
    const conversacion = this.conversacionesService.findOne(conversacionId);
    this.conversacionesService.assertParticipant(conversacion, dto.personaId);
    this.assertNotFinished(conversacion.estado);
    const mensaje = conversacion.mensajes.find((item) => item.id === mensajeId);
    if (!mensaje) throw new NotFoundException(`Mensaje ${mensajeId} no encontrado`);
    if (mensaje.autorId === dto.personaId) throw new BadRequestException('No se puede corregir un mensaje propio');
    if (mensaje.correccion) throw new ConflictException('El mensaje ya tiene una correccion');
    if (!dto.textoCorregido?.trim()) throw new BadRequestException('El texto corregido es obligatorio');
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

  private assertNotFinished(estado: EstadoConversacion): void {
    if ([EstadoConversacion.CERRADA, EstadoConversacion.RECHAZADA].includes(estado)) {
      throw new ConflictException(`La conversacion ya finalizo (estado: ${estado})`);
    }
  }

  private assertId(id: number, nombre: string): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new BadRequestException(`${nombre} debe ser un identificador entero positivo`);
    }
  }
}