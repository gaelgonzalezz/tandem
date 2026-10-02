import { Persona } from "../../persona/entities/persona.entity"

export class Preferencia {
    id: number
    persona: Persona
    permisoConversacion: String
    conversacionesActivasPermitidas: number
    noMolestar: boolean
    bloqueados: number[]
}
