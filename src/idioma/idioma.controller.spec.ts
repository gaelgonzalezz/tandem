import { Test, TestingModule } from '@nestjs/testing';
import { IdiomaController } from './idioma.controller';
import { IdiomaService } from './idioma.service';

describe('IdiomaController', () => {
  let controller: IdiomaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdiomaController],
      providers: [IdiomaService],
    }).compile();

    controller = module.get<IdiomaController>(IdiomaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
