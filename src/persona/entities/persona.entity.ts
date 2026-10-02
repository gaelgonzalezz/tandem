import { Idioma } from "../../idioma/entities/idioma.entity"
import { Pais } from "../../pais/entities/pais.entity"

export class Persona {
    id: number
    nombre: String
    apellido: String
    alias: String
    email: String
    paisResidencia: Pais
    estado: boolean
    idiomasHabla: Idioma[]
    idiomasHablaNivel: String[]
    idiomasAprende: Idioma[]
    idiomasAprendeNivel: String[]
    permisoConversacion: String
    conversacionesActivasPermitidas: number
    noMolestar: boolean
    bloqueados: Persona[]
}
