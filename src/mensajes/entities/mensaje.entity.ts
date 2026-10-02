export class Correccion {
  personaId: number;
  textoCorregido: string;
  comentario?: string;
  creadaEn: Date;
}

export class Mensaje {
  id: number;
  conversacionId: number;
  autorId: number;
  texto: string;
  enviadoEn: Date;
  leido: boolean;
  correccion?: Correccion;
}