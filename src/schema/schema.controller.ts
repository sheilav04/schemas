import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { UpdateSchemaDto } from './dto/update-schema.dto';
import { SchemaService } from './schema.service';

@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @Post()
  create(@Body() schema: CreateSchemaDto) {
    return this.schemaService.create(schema);
  }

  @Get()
  findAll(@Query() sort: Object) {
    console.log(sort);
    return this.schemaService.readSorted(sort);
  }

  @Get('/get-one/:id')
  findOne(@Param('id') id: string) {
    return this.schemaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() schemaNew: UpdateSchemaDto) {
    return this.schemaService.update(id, schemaNew);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schemaService.remove(id);
  }
}
