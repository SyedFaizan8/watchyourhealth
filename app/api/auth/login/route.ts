// app/api/auth/login/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';
export const runtime = 'nodejs';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function readUsers() {
    try {
        const raw = await fs.readFile(USERS_FILE, 'utf8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ ok: false, message: 'email and password required' }, { status: 400 });

    const users = await readUsers();
    const user = users.find((u: any) => u.email === email);
    if (!user) return NextResponse.json({ ok: false, message: 'invalid credentials' }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ ok: false, message: 'invalid credentials' }, { status: 401 });

    // create jwt
    const token = signToken({ userId: user.id, email: user.email });

    // set secure httpOnly cookie (note: in dev we can't set `secure:true` over http)
    const res = NextResponse.json({ ok: true, message: 'logged in' }, { status: 200 });

    // cookie options:
    // - httpOnly: true (not accessible from JS)
    // - path: '/'
    // - maxAge: in seconds
    // - secure: true in production (requires https)
    // - sameSite: 'lax' or 'strict'
    const isProduction = process.env.NODE_ENV === 'production';
    res.cookies.set({
        name: 'token',
        value: token,
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secure: isProduction, // set secure only in production
        maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return res;
}
