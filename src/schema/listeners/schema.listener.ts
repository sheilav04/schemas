import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { SchemaEvent } from '../events/schema.event';

@Injectable()
export class SchemaListener {
  @OnEvent('TASK-CREATED-SUCCESSFULLY')
  handleSchemaEvent(event: SchemaEvent) {
    console.log(`Nueva Tarea ${event.id}`);
  }
}
