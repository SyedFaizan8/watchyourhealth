import classifications from '../config/classifications.json';

export function classifyValue(name: string, rawVal: any): string | null {
    if (!rawVal && rawVal !== 0) return null;
    const ranges = (classifications as any)[name];
    if (!ranges) return null;
    const num = Number(rawVal);
    if (Number.isNaN(num)) return null;
    for (const r of ranges) {
        if (num >= r.min && num <= r.max) return r.label;
    }
    return null;
}
