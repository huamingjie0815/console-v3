import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '$env/dynamic/private';

export const genToken = (
	payload: string | Buffer | object,
	expiresIn: SignOptions['expiresIn'] = '3d'
) => {
	return jwt.sign(payload, env.SERVER_JWT_ACCESS_TOKEN_SECRET as string, { expiresIn }) as string;
};

export const verifyToken = (token: string) => {
	return jwt.verify(token, env.SERVER_JWT_ACCESS_TOKEN_SECRET as string) as string | object;
};