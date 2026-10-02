export class CreatePreferenciaDto {
    personaId: number;
    permisoConversacion: String;
    conversacionesActivasPermitidas: number;
    noMolestar: boolean;
    bloqueados: number[];
}
