import { Request, Response } from 'express';
import * as eventService from './event.service.js';
import { cloudinary } from '../../config/multer.config.js';

const getPublicId = (url?: string): string | null => {
    if (!url) return null;
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i);
    return match ? match[1] : null;
};

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.findAllEvents();
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const event = await eventService.findEventById(id);
        if (!event) return res.status(404).json({ success: false, error: 'Evento no encontrado' });
        res.json({ success: true, data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const eventData = {
            ...req.body,
            image: req.file?.path, // URL completa de Cloudinary
        };
        const event = await eventService.createEvent(eventData);
        res.status(201).json({ success: true, message: 'Evento creado exitosamente', data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const updateData: any = { ...req.body };

        if (req.file) {
            // Borrar imagen anterior de Cloudinary
            const oldEvent = await eventService.findEventById(id);
            const publicId = getPublicId(oldEvent?.image);
            if (publicId) await cloudinary.uploader.destroy(publicId);

            updateData.image = req.file.path;
        }

        const event = await eventService.updateEvent(id, updateData);
        if (!event) return res.status(404).json({ success: false, error: 'Evento no encontrado' });
        res.json({ success: true, message: 'Evento actualizado exitosamente', data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const event = await eventService.findEventById(id);
        const publicId = getPublicId(event?.image);
        if (publicId) await cloudinary.uploader.destroy(publicId);

        const deleted = await eventService.deleteEvent(id);
        if (!deleted) return res.status(404).json({ success: false, error: 'Evento no encontrado' });
        res.json({ success: true, message: 'Evento eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const deactivateEvent = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const event = await eventService.deactivateEvent(id);
        if (!event) return res.status(404).json({ success: false, error: 'Evento no encontrado' });
        res.json({ success: true, message: 'Evento desactivado exitosamente', data: event });
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const updateCupos = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        const cantidad = Number(req.body.cantidad);
        const event = await eventService.updateCuposDisponibles(id, cantidad);
        res.json({ success: true, message: 'Cupos actualizados exitosamente', data: event });
    } catch (error) {
        res.status(400).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const getActiveEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.findActiveEvents();
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const getEventsByDestino = async (req: Request, res: Response) => {
    try {
        const destinoId = req.params.destinoId as string;
        const events = await eventService.findEventsByDestino(destinoId);
        res.json({ success: true, data: events });
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const uploadEventImage = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;
        if (!req.file) return res.status(400).json({ success: false, error: 'No se ha proporcionado ninguna imagen' });

        // Borrar imagen anterior
        const oldEvent = await eventService.findEventById(id);
        const publicId = getPublicId(oldEvent?.image);
        if (publicId) await cloudinary.uploader.destroy(publicId);

        const imageUrl = req.file.path;
        const event = await eventService.updateEventImage(id, imageUrl);
        if (!event) return res.status(404).json({ success: false, error: 'Evento no encontrado' });

        res.json({ success: true, data: event, imageUrl });
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};

export const deleteEventImage = async (req: Request, res: Response) => {
    try {
        const id = req.params.id as string;

        const event = await eventService.findEventById(id);
        const publicId = getPublicId(event?.image);
        if (publicId) await cloudinary.uploader.destroy(publicId);

        const updated = await eventService.deleteEventImage(id);
        if (!updated) return res.status(404).json({ success: false, error: 'Evento no encontrado' });
        res.json({ success: true, data: updated });
    } catch (error) {
        res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Error desconocido' });
    }
};