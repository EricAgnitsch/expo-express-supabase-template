import {NextFunction, Request, Response} from 'express';

// Global error handler - added as the last declaration in app.use(). All uncaught errors will fail here.
export const globalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500)
     .send('Something went wrong!');
};