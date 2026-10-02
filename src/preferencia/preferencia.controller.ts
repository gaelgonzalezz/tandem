import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PreferenciaService } from './preferencia.service';
import { CreatePreferenciaDto } from './dto/create-preferencia.dto';
import { UpdatePreferenciaDto } from './dto/update-preferencia.dto';

@Controller('preferencia')
export class PreferenciaController {
  constructor(private readonly preferenciaService: PreferenciaService) {}

  @Post()
  create(@Body() createPreferenciaDto: CreatePreferenciaDto) {
    return this.preferenciaService.create(createPreferenciaDto);
  }

  @Get()
  findAll() {
    return this.preferenciaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.preferenciaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePreferenciaDto: UpdatePreferenciaDto) {
    return this.preferenciaService.update(+id, updatePreferenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.preferenciaService.remove(+id);
  }
}
