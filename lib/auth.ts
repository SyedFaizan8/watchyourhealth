import * as jwt from 'jsonwebtoken';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET ?? 'dev-secret-please-change';

export interface TokenPayload {
    userId: string;
    email?: string;
    iat?: number;
    exp?: number;
}

export function signToken(payload: object, expiresIn: string | number = '7d'): string {
    // cast the options to any to satisfy type system for various typings
    const options = { expiresIn } as unknown as jwt.SignOptions;
    return jwt.sign(payload as string | object | Buffer, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
}

export function extractTokenFromRequest(req: Request): string | null {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) return authHeader.split(' ')[1];

    const cookieHeader = req.headers.get('cookie');
    if (!cookieHeader) return null;
    const match = cookieHeader
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith('token='));
    if (!match) return null;
    return match.split('=')[1] || null;
}
