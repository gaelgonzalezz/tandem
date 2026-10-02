import { Module } from '@nestjs/common';
import { ConversacionesModule } from '../conversaciones/conversaciones.module';
import { ServicioIdentidadModule } from '../servicio-identidad/servicio-identidad.module';
import { MensajesController } from './mensajes.controller';
import { MensajesService } from './mensajes.service';

@Module({
  imports: [ConversacionesModule, ServicioIdentidadModule],
  controllers: [MensajesController],
  providers: [MensajesService],
})
export class MensajesModule {}