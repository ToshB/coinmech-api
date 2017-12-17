import {Request} from 'express';
export {Request};
declare module 'express' {
  interface Request {
    user?: {
      email: string;
    };
    isAuthenticated: boolean;
  }
}