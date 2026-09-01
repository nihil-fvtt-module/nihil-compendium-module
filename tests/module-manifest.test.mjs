import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

test('module manifest targets the approved Foundry and D&D5e versions', async () => {
  const manifest = JSON.parse(
    await readFile(path.join(repositoryRoot, 'module.json'), 'utf8'),
  );

  assert.equal(manifest.id, 'nihil-compendium-module');
  assert.equal(path.basename(repositoryRoot), manifest.id);
  assert.deepEqual(manifest.compatibility, {
    minimum: '13',
    verified: '13.351',
  });
  assert.deepEqual(manifest.system, ['dnd5e']);
  assert.deepEqual(manifest.relationships.systems, [{
    id: 'dnd5e',
    type: 'system',
    compatibility: {
      minimum: '5.2.4',
      verified: '5.2.4',
    },
  }]);
  assert.deepEqual(manifest.packs, []);
  assert.deepEqual(manifest.packFolders, []);
});
