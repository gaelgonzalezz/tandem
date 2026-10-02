import { forwardRef, Module } from '@nestjs/common';
import { PersonaService } from './persona.service';
import { PersonaController } from './persona.controller';
import { DetalleModule } from '../detalle/detalle.module';
import { IdiomaModule } from '../idioma/idioma.module';
import { PaisModule } from '../pais/pais.module';

@Module({
  imports: [forwardRef(() => DetalleModule), IdiomaModule, PaisModule],
  controllers: [PersonaController],
  providers: [PersonaService],
  exports: [PersonaService]
})
export class PersonaModule {}
