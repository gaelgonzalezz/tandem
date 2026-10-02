import { Module } from '@nestjs/common';
import { ServicioIdentidad } from './servicio-identidad.service';

@Module({
  providers: [ServicioIdentidad],
  exports: [ServicioIdentidad],
})
export class ServicioIdentidadModule {}