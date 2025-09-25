
export function resolvePath(obj: any, path: string): any {
    if (!path) return undefined;
    const parts = path.split('.');
    let cur: any = obj;
    for (const part of parts) {
        if (cur == null) return undefined;

        // pattern: name[key=value] (find)
        const findMatch = part.match(/^([a-zA-Z0-9_]+)\[([a-zA-Z0-9_]+)=([^]+)\]$/);
        // pattern: name[index]
        const idxMatch = part.match(/^([a-zA-Z0-9_]+)\[(\d+)\]$/);

        if (findMatch) {
            const key = findMatch[1];
            const prop = findMatch[2];
            let val = findMatch[3];
            // strip surrounding quotes if present
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            const arr = cur[key];
            if (!Array.isArray(arr)) { cur = undefined; break; }
            cur = arr.find((i: any) => String(i[prop]) === String(val));
        } else if (idxMatch) {
            const key = idxMatch[1];
            const idx = parseInt(idxMatch[2], 10);
            const arr = cur[key];
            cur = Array.isArray(arr) ? arr[idx] : undefined;
        } else {
            // also support additionalFields[fieldName=reps].fieldValue pattern
            const additionalFindMatch = part.match(/^([a-zA-Z0-9_]+)\[([a-zA-Z0-9_]+)=([^]+)\]$/);
            if (additionalFindMatch) {
                // handled above; kept for clarity
            } else {
                cur = cur[part];
            }
        }
    }
    return cur;
}
