import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const scopes = ['common', 'luxterra'];
const assetTypes = ['maps', 'items', 'spells', 'portraits', 'tokens'];

test('content directories and pack guidance exist', async () => {
  await Promise.all(scopes.flatMap((scope) => assetTypes.map((assetType) => (
    access(path.join(repositoryRoot, 'assets', scope, assetType, '.gitkeep'))
  ))));
  await access(path.join(repositoryRoot, 'packs', '.gitkeep'));

  const packGuide = await readFile(
    path.join(repositoryRoot, 'packs', 'README.md'),
    'utf8',
  );
  assert.match(packGuide, /Module Maker/);
  assert.match(packGuide, /common-monsters/);
  assert.match(packGuide, /luxterra-scenes/);
});
