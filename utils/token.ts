import { sign } from 'jsonwebtoken';

export interface Payload {
  id: string;
  expireAt: number;
  mode: 'arrive' | 'leave';
  period: number;
}

export const signToken = (payload: Payload): string => {
  const expiresIn = `${payload.expireAt - Date.now()}ms`;

  return sign(payload, process.env.JWT_SECRET!, { expiresIn });
};
