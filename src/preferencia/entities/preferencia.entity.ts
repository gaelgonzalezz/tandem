import { Persona } from "../../persona/entities/persona.entity"

export class Preferencia {
    id: number
    permisoConversacion: String
    conversacionesActivasPermitidas: number
    noMolestar: boolean
    bloqueados: Persona[]
}
