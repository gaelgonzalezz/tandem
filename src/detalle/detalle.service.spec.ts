import { Test, TestingModule } from '@nestjs/testing';
import { DetalleService } from './detalle.service';

describe('DetalleService', () => {
  let service: DetalleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DetalleService],
      exports: [DetalleService],
    }).compile();

    service = module.get<DetalleService>(DetalleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
