import Log from './log.model.js';

interface LogData {
  nivel: 'info' | 'warn' | 'error';
  evento: string;
  metodo?: string;
  ruta?: string;
  statusCode?: number;
  ip?: string;
  userId?: string;
  detalle?: string;
}

export const registrarLog = async (data: LogData) => {
  try {
    await Log.create(data);
  } catch (error) {
    // Si falla el log no queremos romper la app
    console.error('Error guardando log:', error);
  }
};