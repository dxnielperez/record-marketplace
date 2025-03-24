import jwt from 'jsonwebtoken';
import { ClientError } from './client-error.js';
export function errorMiddleware(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- next must be declared for error middleware
next) {
    console.log('error midd');
    if (err instanceof ClientError) {
        res.status(err.status).json({ error: err.message });
    }
    else if (err instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ error: 'invalid access token' });
    }
    else {
        console.error(err);
        res.status(500).json({
            error: 'an unexpected error occurred',
            message: err instanceof Error ? err.message : undefined,
        });
    }
}
