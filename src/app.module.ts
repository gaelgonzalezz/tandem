import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonaModule } from './persona/persona.module';
import { IdiomaModule } from './idioma/idioma.module';
import { PaisModule } from './pais/pais.module';
import { DetalleModule } from './detalle/detalle.module';
import { PreferenciaModule } from './preferencia/preferencia.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'gestion-perfiles',
    }),
    PersonaModule,
    IdiomaModule,
    PaisModule,
    DetalleModule,
    PreferenciaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
