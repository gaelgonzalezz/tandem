import { Detalle } from "../../detalle/entities/detalle.entity"
import { Idioma } from "../../idioma/entities/idioma.entity"
import { Pais } from "../../pais/entities/pais.entity"

export class Persona {
    id: number
    nombre: String
    apellido: String
    alias: String
    email: String
    paisResidencia: Pais | undefined
    estado: boolean
    idiomasHabla: (Idioma | undefined)[]
    idiomasHablaNivel: (Detalle | undefined)[]
    idiomasAprende: (Idioma | undefined)[]
    idiomasAprendeNivel: (Detalle | undefined)[]
}
