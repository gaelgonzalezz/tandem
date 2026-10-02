import { Module } from '@nestjs/common';
import { PreferenciaService } from './preferencia.service';
import { PreferenciaController } from './preferencia.controller';
import { DetalleModule } from '../detalle/detalle.module';
import { IdiomaModule } from '../idioma/idioma.module';
import { PaisModule } from '../pais/pais.module';
import { PersonaModule } from '../persona/persona.module';

@Module({
  imports: [
    PaisModule,
    IdiomaModule,
    DetalleModule,
    PersonaModule,
  ],
  controllers: [PreferenciaController],
  providers: [PreferenciaService],
  exports: [PreferenciaService]
})
export class PreferenciaModule {}
