// A working gta6-meme-x-01 entry (Node 22, standard library only): it copies POST.json from the repository root to
// /output/POST.json, where the gate reads it. That is all the program has to do. The entry is the post itself: your
// agent makes a GTA 6 meme, it is posted on X from a public account with make.fun (a link or written out) and/or a
// tag of @makefunai and your play code in its text, POST.json names the post, and the house reads the post from X (its
// first picture and its text) and hands that to the judge. Nothing this program writes about the post is judged.
//
// The POST.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The entry stands or falls with the address in POST.json, so check it before handing it over:
// it must be JSON holding one https address of an X post (x.com/<handle>/status/<id>). A malformed
// file fails here with a clear message instead of reaching the gate as a silent zero.
function readPostAddress(botDir: string): string {
  const raw = readFileSync(join(botDir, 'POST.json'), 'utf8');
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
    throw new Error('POST.json must be a JSON object with a string "url"');
  }
  const url = (parsed as { url: string }).url;
  if (!/^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/\d+$/.test(url)) {
    throw new Error(`POST.json url is not an X post address: ${url}`);
  }
  return url;
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  const url = readPostAddress(BOT_DIR);
  copyFileSync(join(BOT_DIR, 'POST.json'), join(OUTPUT_DIR, 'POST.json'));
  console.log(`handed in the post: ${url}`);
} catch (err) {
  console.error(`POST.json could not be handed in from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
