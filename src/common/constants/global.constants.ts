import * as path from 'path';

export const DATABASE_PATH = path.join(process.cwd(), 'src', 'database', 'data.json');

export const HORAS = 12;
export const MILISEGUNDOS_HORAS = HORAS * 3600 * 1000;
