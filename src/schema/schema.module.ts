import { Module } from '@nestjs/common';
import { SchemaListener } from './listeners/schema.listener';
import { SchemaController } from './schema.controller';
import { SchemaService } from './schema.service';

@Module({
  controllers: [SchemaController],
  providers: [SchemaService, SchemaListener],
})
export class SchemaModule {}
