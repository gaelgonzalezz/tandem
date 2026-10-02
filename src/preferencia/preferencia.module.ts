import { Module } from '@nestjs/common';
import { PreferenciaService } from './preferencia.service';
import { PreferenciaController } from './preferencia.controller';

@Module({
  controllers: [PreferenciaController],
  providers: [PreferenciaService],
  exports: [PreferenciaService]
})
export class PreferenciaModule {}
