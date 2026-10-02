import { Module } from '@nestjs/common';
import { IdiomaService } from './idioma.service';
import { IdiomaController } from './idioma.controller';

@Module({
  controllers: [IdiomaController],
  providers: [IdiomaService],
  exports: [IdiomaService]
})
export class IdiomaModule {}
