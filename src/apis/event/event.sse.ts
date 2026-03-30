import { Request, Response } from 'express';

const clients = new Set<Response>();

export const sseStream = (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders();

    const keepAlive = setInterval(() => res.write(': ping\n\n'), 30000);

    clients.add(res);

    req.on('close', () => {
        clearInterval(keepAlive);
        clients.delete(res);
    });
};

export const broadcastEventChange = (type: 'event_created' | 'event_updated' | 'event_deleted', data: object) => {
    const payload = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
    clients.forEach(client => client.write(payload));
};