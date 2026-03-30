import Log from './log.model.js';
export const registrarLog = async (data) => {
    try {
        await Log.create(data);
    }
    catch (error) {
        // Si falla el log no queremos romper la app
        console.error('Error guardando log:', error);
    }
};
