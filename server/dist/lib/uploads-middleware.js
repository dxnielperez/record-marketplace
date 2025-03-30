import multer from 'multer';
export const uploadsMiddleware = multer({ storage: multer.memoryStorage() });
