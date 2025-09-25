import { NextResponse } from 'next/server';
import { findBySessionId } from '@/data/data';
import assessmentsConfig from '@/config/assessments.json';
import { resolvePath } from '@/lib/json-path';
import { renderPdfFromTemplate } from '@/lib/pdf';
import { classifyValue } from '@/lib/classify';
import path from 'path';
import { extractTokenFromRequest, verifyToken } from '@/lib/auth';

export const runtime = 'nodejs';

export async function POST(req: Request) {
    // 1. Extract token (cookie or Authorization header)
    const token = extractTokenFromRequest(req);
    if (!token) return NextResponse.json({ ok: false, message: 'Unauthorized - token missing' }, { status: 401 });

    // 2. Verify token
    // try {
    //     verifyToken(token); // will throw if invalid
    // } catch (err) {
    //     return NextResponse.json({ ok: false, message: 'Unauthorized - token invalid' }, { status: 401 });
    // }

    // 3. proceed with your existing logic
    const body = await req.json();
    const session_id = body.session_id;
    if (!session_id) return NextResponse.json({ ok: false, message: 'session_id required' }, { status: 400 });

    const record = findBySessionId(session_id);
    if (!record) return NextResponse.json({ ok: false, message: 'session not found' }, { status: 404 });

    const cfg = (assessmentsConfig as any)[record.assessment_id];
    if (!cfg) return NextResponse.json({ ok: false, message: 'no config for assessment_id: ' + record.assessment_id }, { status: 400 });

    const model: any = { meta: { session_id, assessment_id: record.assessment_id, title: cfg.title }, sections: [] };
    for (const s of cfg.sections) {
        const fields: any[] = [];
        for (const f of s.fields) {
            let raw = resolvePath(record, f.path);
            if (raw && typeof raw === 'object' && 'fieldValue' in raw) raw = raw.fieldValue;
            const value = raw !== undefined && raw !== null ? String(raw) : '';
            let classification = null;
            if (f.classify) classification = classifyValue(f.classify, raw);
            fields.push({ label: f.label, value, classification });
        }
        model.sections.push({ id: s.id, title: s.title, fields });
    }

    const templateName = cfg.template || 'default.ejs';
    const outPath = path.join(process.cwd(), 'generated-reports', `${session_id}-${record.assessment_id}.pdf`);

    try {
        await renderPdfFromTemplate(templateName, model, outPath);
        return NextResponse.json({ ok: true, path: outPath }, { status: 200 });
    } catch (err: any) {
        console.error('PDF generation error', err);
        return NextResponse.json({ ok: false, message: String(err) }, { status: 500 });
    }
}
