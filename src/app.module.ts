import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConversacionesModule } from './conversaciones/conversaciones.module';
import { MensajesModule } from './mensajes/mensajes.module';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ConversacionesModule,
    MensajesModule,
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'gestion-conversaciones',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
