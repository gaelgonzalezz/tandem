import { Test, TestingModule } from '@nestjs/testing';
import { DetalleController } from './detalle.controller';
import { DetalleService } from './detalle.service';

describe('DetalleController', () => {
  let controller: DetalleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DetalleController],
      providers: [DetalleService],
    }).compile();

    controller = module.get<DetalleController>(DetalleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
