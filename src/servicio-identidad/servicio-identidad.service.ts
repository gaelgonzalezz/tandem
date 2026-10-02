import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

interface PersonaServicioI {
  id: number;
  estado: boolean;
  idiomasHabla?: Array<string | number | Record<string, unknown>>;
}

interface PreferenciaServicioI {
  persona?: { id?: number };
  personaId?: number;
  conversacionesActivasPermitidas?: number;
  bloqueados?: number[];
}

@Injectable()
export class ServicioIdentidad {
  private readonly baseUrl = (process.env.SERVICIO_I_URL ?? 'http://localhost:3001').replace(/\/$/, '');

  async autorizarInicio(iniciadorId: number, destinatarioId: number, idioma: string): Promise<void> {
    const query = new URLSearchParams({ idioma });
    const respuesta = await this.request<{ permitido: boolean; motivo?: string }>(
      `/persona/${iniciadorId}/puede-contactar/${destinatarioId}?${query}`,
      true,
    );
    if (!respuesta || typeof respuesta.permitido !== 'boolean') {
      throw new ServiceUnavailableException('Servicio I respondio con un formato de autorizacion invalido');
    }
    if (!respuesta.permitido) {
      if (respuesta.motivo?.toLowerCase().includes('inexistent') || respuesta.motivo?.toLowerCase().includes('no existe')) {
        throw new NotFoundException('El iniciador o el destinatario no existe en Servicio I');
      }
      throw new BadRequestException(`Servicio I no autoriza el contacto${respuesta.motivo ? `: ${respuesta.motivo}` : ''}`);
    }
  }

  async validarEnvio(personaAId: number, personaBId: number): Promise<void> {
    const [personaA, personaB, preferencias] = await Promise.all([
      this.obtenerPersona(personaAId),
      this.obtenerPersona(personaBId),
      this.obtenerPreferencias(),
    ]);
    if (personaA.estado === false || personaB.estado === false) {
      throw new BadRequestException('No se pueden enviar mensajes: una persona esta suspendida');
    }
    const preferenciaA = this.preferenciaDe(preferencias, personaAId);
    const preferenciaB = this.preferenciaDe(preferencias, personaBId);
    if (preferenciaA?.bloqueados?.includes(personaBId) || preferenciaB?.bloqueados?.includes(personaAId)) {
      throw new BadRequestException('No se pueden enviar mensajes: existe un bloqueo entre las personas');
    }
  }

  async limiteConversaciones(personaId: number): Promise<number> {
    const preferencias = await this.obtenerPreferencias();
    const limite = this.preferenciaDe(preferencias, personaId)?.conversacionesActivasPermitidas ?? 5;
    if (!Number.isInteger(limite) || limite < 1 || limite > 10) {
      throw new ServiceUnavailableException(`Servicio I devolvio un limite de conversaciones invalido para ${personaId}`);
    }
    return limite;
  }

  async hablaIdioma(personaId: number, idioma: string): Promise<boolean> {
    const persona = await this.obtenerPersona(personaId);
    return (persona.idiomasHabla ?? []).some((idiomaPersona) => {
      if (typeof idiomaPersona === 'string' || typeof idiomaPersona === 'number') {
        return String(idiomaPersona).toLowerCase() === idioma.toLowerCase();
      }
      return Object.entries(idiomaPersona).some(([key, value]) =>
        ['codigo', 'code', 'alias', 'nombre', 'id'].includes(key.toLowerCase()) &&
        String(value).toLowerCase() === idioma.toLowerCase(),
      );
    });
  }

  private async obtenerPersona(personaId: number): Promise<PersonaServicioI> {
    return this.request<PersonaServicioI>(`/persona/${personaId}`, true);
  }

  private async obtenerPreferencias(): Promise<PreferenciaServicioI[]> {
    const preferencias = await this.request<PreferenciaServicioI[]>('/preferencia');
    if (!Array.isArray(preferencias)) {
      throw new ServiceUnavailableException('Servicio I devolvio una lista de preferencias invalida');
    }
    return preferencias;
  }

  private preferenciaDe(preferencias: PreferenciaServicioI[], personaId: number) {
    return preferencias.find((preferencia) => (preferencia.persona?.id ?? preferencia.personaId) === personaId);
  }

  private async request<T>(path: string, notFoundIfMissing = false): Promise<T> {
    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}${path}`, { signal: AbortSignal.timeout(3000) });
    } catch {
      throw new ServiceUnavailableException('Dependencia Servicio I no disponible');
    }
    if (response.status === 404 && notFoundIfMissing) {
      throw new NotFoundException('La persona indicada no existe en Servicio I');
    }
    if (!response.ok) {
      throw new ServiceUnavailableException(`Dependencia Servicio I respondio HTTP ${response.status}`);
    }
    try {
      return (await response.json()) as T;
    } catch {
      throw new ServiceUnavailableException('Servicio I devolvio una respuesta JSON invalida');
    }
  }
}