#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

async function loadEnv(filePath) {
  const text = await fs.readFile(filePath, 'utf8');
  const lines = text.split(/\r?\n/);
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
    env[key] = value;
  }
  return env;
}

async function main() {
  const cwd = process.cwd();
  const candidates = ['.env.local', '.env'];
  let env;
  for (const c of candidates) {
    const p = path.join(cwd, c);
    try {
      await fs.access(p);
      env = await loadEnv(p);
      console.log('Loaded env file:', c);
      break;
    } catch (e) {
      // ignore
    }
  }
  if (!env) {
    console.error('No .env.local or .env found in', cwd);
    process.exit(2);
  }

  const SUPABASE_URL = env.VITE_SUPABASE_URL;
  const SUPABASE_ANON_KEY = env.VITE_SUPABASE_ANON_KEY;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in env file');
    process.exit(2);
  }

  console.log('Supabase URL:', SUPABASE_URL);
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false },
  });

  try {
    // Try a harmless read from `transactions` (may fail if table missing or RLS blocks)
    const { data, error, status } = await supabase.from('transactions').select('id').limit(1).maybeSingle();
    if (error) {
      console.error('Supabase query error:', error.message || error);
      console.error('HTTP status:', status);
      console.log('Connectivity to Supabase endpoint appears OK (HTTP responded).');
      console.log('If this is an RLS or schema error, sign in and ensure the `transactions` table exists.');
      process.exit(0);
    }
    console.log('Query OK. Sample result:', data);
    process.exit(0);
  } catch (err) {
    console.error('Request failed:', err?.message || err);
    process.exit(2);
  }
}

main();
