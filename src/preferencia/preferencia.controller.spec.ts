import { Test, TestingModule } from '@nestjs/testing';
import { PreferenciaController } from './preferencia.controller';
import { PreferenciaService } from './preferencia.service';

describe('PreferenciaController', () => {
  let controller: PreferenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreferenciaController],
      providers: [PreferenciaService],
    }).compile();

    controller = module.get<PreferenciaController>(PreferenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
