import { Persona } from "../../persona/entities/persona.entity"

export class CreatePreferenciaDto {
    permisoConversacion: String;
    conversacionesActivasPermitidas: number;
    noMolestar: boolean;
    bloqueados: Persona[];
}
