import { Controller, Body, Patch, Param } from '@nestjs/common';
import { SpecsService } from './specs.service';
import { UpdateSpecDto } from './dto/update-spec.dto';

@Controller('specs')
export class SpecsController {
  constructor(private readonly specsService: SpecsService) {}

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSpecDto: UpdateSpecDto) {
  //   return this.specsService.update(+id, updateSpecDto);
  // }
}
