import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
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

async function writeUsers(users: any[]) {
    await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

export async function POST(req: Request) {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) return NextResponse.json({ ok: false, message: 'email and password required' }, { status: 400 });

    const users = await readUsers();
    if (users.find((u: any) => u.email === email)) {
        return NextResponse.json({ ok: false, message: 'user exists' }, { status: 400 });
    }
    const hash = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), email, passwordHash: hash };
    users.push(user);
    await writeUsers(users);
    return NextResponse.json({ ok: true, userId: user.id }, { status: 201 });
}
