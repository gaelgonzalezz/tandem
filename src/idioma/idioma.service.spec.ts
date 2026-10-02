import { Test, TestingModule } from '@nestjs/testing';
import { IdiomaService } from './idioma.service';

describe('IdiomaService', () => {
  let service: IdiomaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdiomaService],
    }).compile();

    service = module.get<IdiomaService>(IdiomaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
