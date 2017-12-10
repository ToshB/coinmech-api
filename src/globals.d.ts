import {User} from './entity/User';

declare module 'express' {
  interface Request {
    user?: User;
    isAuthenticated: boolean;
  }
}