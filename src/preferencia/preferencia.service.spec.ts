import { Test, TestingModule } from '@nestjs/testing';
import { PreferenciaService } from './preferencia.service';

describe('PreferenciaService', () => {
  let service: PreferenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreferenciaService],
    }).compile();

    service = module.get<PreferenciaService>(PreferenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
