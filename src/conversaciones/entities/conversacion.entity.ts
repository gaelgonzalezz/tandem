import { Mensaje } from '../../mensajes/entities/mensaje.entity';

export enum EstadoConversacion {
  PENDIENTE = 'pendiente',
  ACTIVA = 'activa',
  RECHAZADA = 'rechazada',
  CERRADA = 'cerrada',
}

export class Conversacion {
  id: number;
  iniciadorId: number;
  destinatarioId: number;
  idioma: string;
  estado: EstadoConversacion;
  creadaEn: Date;
  mensajes: Mensaje[];
}