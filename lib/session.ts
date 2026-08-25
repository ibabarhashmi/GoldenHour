const enc = new TextEncoder();
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;


const b64url = (b: ArrayBuffer | Uint8Array) =>
  btoa(String.fromCharCode(...new Uint8Array(b)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');


const unb64url = (s: string) =>
  Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));


const key = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is not set');
  return crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']
  );
};


export async function signSession(uid: string): Promise<string> {
  const payload = b64url(enc.encode(JSON.stringify({ uid, exp: Date.now() + THIRTY_DAYS_MS })));
  const sig = b64url(await crypto.subtle.sign('HMAC', await key(), enc.encode(payload)));
  return `${payload}.${sig}`;
}


export async function verifySession(token?: string): Promise<{ uid: string } | null> {
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig) return null;


  const valid = await crypto.subtle.verify(
    'HMAC', await key(), unb64url(sig) as unknown as BufferSource, enc.encode(payload)
  );
  if (!valid) return null;


  try {
    const { uid, exp } = JSON.parse(new TextDecoder().decode(unb64url(payload)));
    return typeof uid === 'string' && exp > Date.now() ? { uid } : null;
  } catch {
    return null;
  }
}