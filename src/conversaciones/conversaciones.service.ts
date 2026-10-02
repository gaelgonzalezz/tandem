import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccionConversacionDto } from './dto/accion-conversacion.dto';
import { CrearConversacionDto } from './dto/crear-conversacion.dto';
import { Conversacion, EstadoConversacion } from './entities/conversacion.entity';
import { Mensaje } from '../mensajes/entities/mensaje.entity';
import { ServicioIdentidad } from '../servicio-identidad/servicio-identidad.service';

@Injectable()
export class ConversacionesService {
  private static readonly conversaciones: Conversacion[] = [];
  private static siguienteConversacionId = 1;
  private static siguienteMensajeId = 1;

  constructor(private readonly servicioIdentidad: ServicioIdentidad) {}

  async create(dto: CrearConversacionDto): Promise<Conversacion> {
    if (dto.iniciadorId === dto.destinatarioId) {
      throw new BadRequestException('Una conversacion requiere dos personas distintas');
    }
    if (!dto.idioma?.trim() || !dto.mensajePresentacion?.trim()) {
      throw new BadRequestException('El idioma y el mensaje de presentacion son obligatorios');
    }

    const idioma = dto.idioma.trim();
    const existeAbierta = ConversacionesService.conversaciones.some((conversacion) =>
      this.mismaPareja(conversacion, dto.iniciadorId, dto.destinatarioId) &&
      conversacion.idioma.toLowerCase() === idioma.toLowerCase() &&
      [EstadoConversacion.PENDIENTE, EstadoConversacion.ACTIVA].includes(conversacion.estado),
    );
    if (existeAbierta) {
      throw new ConflictException('Ya existe una conversacion pendiente o activa entre estas personas en ese idioma');
    }

    await this.servicioIdentidad.puedeContactar(dto.iniciadorId, dto.destinatarioId, idioma);

    const conversacion = new Conversacion();
    conversacion.id = ConversacionesService.siguienteConversacionId++;
    conversacion.iniciadorId = dto.iniciadorId;
    conversacion.destinatarioId = dto.destinatarioId;
    conversacion.idioma = idioma;
    conversacion.estado = EstadoConversacion.PENDIENTE;
    conversacion.creadaEn = new Date();
    conversacion.mensajes = [this.nuevoMensaje(conversacion.id, dto.iniciadorId, dto.mensajePresentacion)];
    ConversacionesService.conversaciones.push(conversacion);
    return conversacion;
  }

  async accept(id: number, dto: AccionConversacionDto): Promise<Conversacion> {
    const conversacion = this.findOne(id);
    this.assertPending(conversacion);
    if (dto.personaId !== conversacion.destinatarioId) {
      throw new BadRequestException('Solo el destinatario puede aceptar la conversacion');
    }

    const [limiteIniciador, limiteDestinatario] = await Promise.all([
      this.servicioIdentidad.obtenerLimiteConversaciones(conversacion.iniciadorId),
      this.servicioIdentidad.obtenerLimiteConversaciones(conversacion.destinatarioId),
    ]);
    if (this.cantidadActivas(conversacion.iniciadorId) >= limiteIniciador) {
      throw new ConflictException('El iniciador alcanzo su limite de conversaciones activas');
    }
    if (this.cantidadActivas(conversacion.destinatarioId) >= limiteDestinatario) {
      throw new ConflictException('El destinatario alcanzo su limite de conversaciones activas');
    }

    conversacion.estado = EstadoConversacion.ACTIVA;
    return conversacion;
  }

  reject(id: number, dto: AccionConversacionDto): Conversacion {
    const conversacion = this.findOne(id);
    this.assertPending(conversacion);
    if (dto.personaId !== conversacion.destinatarioId) {
      throw new BadRequestException('Solo el destinatario puede rechazar la conversacion');
    }
    conversacion.estado = EstadoConversacion.RECHAZADA;
    return conversacion;
  }

  close(id: number, dto: AccionConversacionDto): Conversacion {
    const conversacion = this.findOne(id);
    this.assertActive(conversacion);
    this.assertParticipant(conversacion, dto.personaId);
    conversacion.estado = EstadoConversacion.CERRADA;
    return conversacion;
  }

  findForPerson(personaId: number, estado?: string): Conversacion[] {
    if (estado && !Object.values(EstadoConversacion).includes(estado as EstadoConversacion)) {
      throw new BadRequestException(`Estado invalido: ${estado}`);
    }
    return ConversacionesService.conversaciones.filter((conversacion) =>
      this.esParticipante(conversacion, personaId) && (!estado || conversacion.estado === estado),
    );
  }

  findOne(id: number): Conversacion {
    const conversacion = ConversacionesService.conversaciones.find((item) => item.id === id);
    if (!conversacion) {
      throw new NotFoundException(`Conversacion ${id} no encontrada`);
    }
    return conversacion;
  }

  assertParticipant(conversacion: Conversacion, personaId: number): void {
    if (!this.esParticipante(conversacion, personaId)) {
      throw new BadRequestException('Solo los participantes pueden operar sobre la conversacion');
    }
  }

  assertActive(conversacion: Conversacion): void {
    if (conversacion.estado !== EstadoConversacion.ACTIVA) {
      throw new ConflictException(`La conversacion no esta activa (estado: ${conversacion.estado})`);
    }
  }

  nuevoMensaje(conversacionId: number, autorId: number, texto: string): Mensaje {
    const mensaje = new Mensaje();
    mensaje.id = ConversacionesService.siguienteMensajeId++;
    mensaje.conversacionId = conversacionId;
    mensaje.autorId = autorId;
    mensaje.texto = texto.trim();
    mensaje.enviadoEn = new Date();
    mensaje.leido = false;
    return mensaje;
  }

  cantidadActivas(personaId: number): number {
    return ConversacionesService.conversaciones.filter((conversacion) =>
      conversacion.estado === EstadoConversacion.ACTIVA && this.esParticipante(conversacion, personaId),
    ).length;
  }

  private assertPending(conversacion: Conversacion): void {
    if (conversacion.estado !== EstadoConversacion.PENDIENTE) {
      throw new ConflictException(`La conversacion ya no esta pendiente (estado: ${conversacion.estado})`);
    }
  }

  private esParticipante(conversacion: Conversacion, personaId: number): boolean {
    return conversacion.iniciadorId === personaId || conversacion.destinatarioId === personaId;
  }

  private mismaPareja(conversacion: Conversacion, personaAId: number, personaBId: number): boolean {
    return (conversacion.iniciadorId === personaAId && conversacion.destinatarioId === personaBId) ||
      (conversacion.iniciadorId === personaBId && conversacion.destinatarioId === personaAId);
  }
}