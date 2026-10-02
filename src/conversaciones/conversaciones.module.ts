import { Module } from '@nestjs/common';
import { ServicioIdentidadModule } from '../servicio-identidad/servicio-identidad.module';
import { ConversacionesController } from './conversaciones.controller';
import { ConversacionesService } from './conversaciones.service';

@Module({
  imports: [ServicioIdentidadModule],
  controllers: [ConversacionesController],
  providers: [ConversacionesService],
  exports: [ConversacionesService],
})
export class ConversacionesModule {}