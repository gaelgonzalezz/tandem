import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { PaisController } from './pais.controller';

@Module({
  controllers: [PaisController],
  providers: [PaisService],
  exports: [PaisService]
})
export class PaisModule {}
