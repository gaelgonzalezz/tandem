import { forwardRef, Module } from '@nestjs/common';
import { DetalleService } from './detalle.service';
import { DetalleController } from './detalle.controller';
import { IdiomaModule } from '../idioma/idioma.module';
import { PersonaModule } from '../persona/persona.module';

@Module({
  imports: [
    forwardRef(() => PersonaModule),
    IdiomaModule
  ],
  controllers: [DetalleController],
  providers: [DetalleService],
  exports: [DetalleService]
})
export class DetalleModule {}
