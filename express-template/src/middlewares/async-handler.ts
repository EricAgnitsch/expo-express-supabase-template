import {NextFunction, Request, Response} from 'express';

// Async handling middleware
export const asyncHandler = fn => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next))
         .catch(next);
};