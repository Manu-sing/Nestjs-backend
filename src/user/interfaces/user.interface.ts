import { Document } from 'mongoose';

export interface User extends Document {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface UserDetails {
  id: string;
  name: string;
  email: string;
}
