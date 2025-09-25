
import path from 'path';
import fs from 'fs/promises';
import ejs from 'ejs';
import puppeteer from 'puppeteer';

const TEMPLATES_DIR = path.join(process.cwd(), 'templates');
const OUT_DIR = path.join(process.cwd(), 'generated-reports');

async function ensureOutDir() {
    await fs.mkdir(OUT_DIR, { recursive: true });
}

function safeFilename(name: string) {
    return name.replace(/[^a-z0-9\-_\.]/gi, '_');
}

export async function renderPdfFromTemplate(templateFile: string, model: any, outPath: string) {
    await ensureOutDir();
    const templatePath = path.join(TEMPLATES_DIR, templateFile);
    console.log('[pdf] using template:', templatePath);

    const exists = await fs.access(templatePath).then(() => true).catch(() => false);
    if (!exists) {
        throw new Error(`Template not found: ${templateFile} (expected at ${templatePath})`);
    }

    // Log model summary so you can verify data existence
    try {
        console.log('[pdf] model meta:', model.meta || {});
        console.log('[pdf] sections count:', Array.isArray(model.sections) ? model.sections.length : 0);
        if (Array.isArray(model.sections) && model.sections.length) {
            console.log('[pdf] first section sample fields:', JSON.stringify(model.sections[0].fields?.slice?.(0, 5) ?? [], null, 2));
        }
    } catch (err) {
        console.warn('[pdf] failed to log model preview', err);
    }

    // Render HTML string (keep it in memory)
    const html = await ejs.renderFile(templatePath, model, { async: true });

    // Log rendered HTML length for quick check
    console.log('[pdf] rendered HTML length:', (html || '').length);

    // Launch puppeteer and create PDF buffer
    const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0', timeout: 60000 });
        // slight delay
        await new Promise(r => setTimeout(r, 200));
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true }) as Buffer;

        // write pdf buffer to disk
        await fs.writeFile(outPath, pdfBuffer);
        console.log('[pdf] wrote PDF to', outPath);
        return outPath;
    } finally {
        await browser.close();
    }
}
