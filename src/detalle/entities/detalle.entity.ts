import { Idioma } from '../../idioma/entities/idioma.entity';
import { Persona } from '../../persona/entities/persona.entity';

export class Detalle {
    id: number;
    persona: Persona | undefined;
    idioma: Idioma | undefined;
    nivel: string;
}
