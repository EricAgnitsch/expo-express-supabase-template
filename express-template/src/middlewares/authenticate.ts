import {NextFunction, Request, Response} from 'express';
import {verify} from 'jsonwebtoken';
import EnvironmentVariables from '../environment-variables';
import {asyncHandler} from './async-handler';

// Auth middleware -- used to enforce auth validation on endpoints that requires a valid Supabase JWT
export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401)
              .json({message: 'Missing or malformed Authorization header'});
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    req.decodedToken = verify(token, EnvironmentVariables.SUPABASE_JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401)
              .json({message: 'Invalid or expired token'});
  }
});