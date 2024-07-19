import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import * as fs from 'fs/promises';
import { DATABASE_PATH } from '../common/constants/global.constants';
import { CreateSchemaDto } from './dto/create-schema.dto';
import { SchemaDto } from './dto/schema.dto';
import { UpdateSchemaDto } from './dto/update-schema.dto';
import { SchemaEvent } from './events/schema.event';

@Injectable()
export class SchemaService {
  constructor(private eventEmitter: EventEmitter2) {}

  async create(schema: CreateSchemaDto) {
    const newId = randomUUID();
    const schemas: CreateSchemaDto[] = await this.findAll();
    schema['id'] = newId;
    schemas.push(schema);
    await fs.writeFile(DATABASE_PATH, JSON.stringify(schemas));

    const schemaEvent = new SchemaEvent();
    schemaEvent.id = newId;
    this.eventEmitter.emit('TASK-CREATED-SUCCESSFULLY', schemaEvent);
  }

  async findAll(): Promise<SchemaDto[]> {
    const data = await fs.readFile(DATABASE_PATH);
    return JSON.parse(data.toString());
  }

  getDate() {
    return new Date().toISOString();
  }

  async readSorted(sort: Object) {
    const data = await this.findAll();

    if (!sort) return data;

    //sort => { "sort" : "priority" | "scheludedTime" }
    const ordered = sort['sort'];

    if (ordered == 'priority') {
      data.sort((a, b) => {
        if (!a.priority && !b.priority) {
          return 0;
        }

        if (!a.priority) return 1;
        if (!b.priority) return -1;

        return b.priority - a.priority;
      });
    }

    if (ordered == 'scheduledTime') {
      data.sort((a, b) => {
        const fechaA = new Date(a.scheduledTime).getTime();
        const fechaB = new Date(b.scheduledTime).getTime();
        if (!fechaA && !fechaB) {
          return 0;
        }

        if (!fechaA) return 1;
        if (!fechaB) return -1;

        return fechaB - fechaA;
      });
    }

    console.log(data);
    return data;
  }

  async findOne(id: string) {
    const data: SchemaDto[] = await this.findAll();
    const schema = data.find((task) => task.id == id);

    if (!schema) throw new NotFoundException();

    return schema;
  }

  async update(id: string, schemaNew: UpdateSchemaDto) {
    const data: SchemaDto[] = await this.findAll();
    const index = data.findIndex((task) => task.id == id);

    if (index == -1) throw new BadRequestException();

    data[index] = { ...data[index], ...schemaNew };

    await fs.writeFile(DATABASE_PATH, JSON.stringify(data));
  }

  async remove(id: string) {
    const data = await this.findAll();
    const index = data.findIndex((task) => task.id == id);

    if (index == -1) throw new BadRequestException();

    data.splice(index, 1);

    await fs.writeFile(DATABASE_PATH, JSON.stringify(data));
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleCron() {
    const horas = 12;
    let milisegundosHoras = horas * 3600 * 1000;
    const data = await this.findAll();
    data.map((task) => {
      if (task.scheduledTime) {
        const fecha = new Date(task.scheduledTime).getTime();

        const fechaSistema = new Date().getTime();

        const resta = fecha - fechaSistema;

        if (resta < milisegundosHoras && resta > 0) {
          let horasRestantes = resta / 3600 / 1000;
          let minutosDecimal = (horasRestantes - Math.floor(horasRestantes)) * 60;
          console.log(
            `La tarea ${task.id} vence en ${Math.round(horasRestantes)} HORAS y en ${Math.round(minutosDecimal)} MINUTO(S)`,
          );
        }
      }
    });
    //console.log('se ejcuta cada 5 segundos');
  }
}
