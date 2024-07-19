import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthAdmin } from '../guard/auth/auth.admin.guard';
import { AuthUser } from '../guard/auth/auth.user.guard';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { UpdateSchemaDto } from './dto/update-schema.dto';
import { SchemaService } from './schema.service';

@Controller('schema')
export class SchemaController {
  constructor(private readonly schemaService: SchemaService) {}

  @UseGuards(AuthAdmin)
  @Post()
  create(@Body() schema: CreateSchemaDto) {
    return this.schemaService.create(schema);
  }

  @UseGuards(AuthUser)
  @Get()
  findAll(@Query() sort: Object) {
    console.log(sort);
    return this.schemaService.readSorted(sort);
  }

  @Get('/get-date')
  getDate() {
    return this.schemaService.getDate();
  }

  @UseGuards(AuthUser)
  @Get('/get-one/:id')
  findOne(@Param('id') id: string) {
    return this.schemaService.findOne(id);
  }

  @UseGuards(AuthAdmin)
  @Patch(':id')
  update(@Param('id') id: string, @Body() schemaNew: UpdateSchemaDto) {
    return this.schemaService.update(id, schemaNew);
  }

  @UseGuards(AuthAdmin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.schemaService.remove(id);
  }
}
