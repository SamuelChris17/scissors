import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';
import 'express';
import { IUser } from './models/userModel';

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload | string;
    }
}
declare global {
    namespace Express {
      interface Request {
        user?: IUser; 
      }
    }
  }