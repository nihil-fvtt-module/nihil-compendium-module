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
  assert.deepEqual(manifest.packs, [
    {
      name: 'common-monsters',
      label: '액터',
      path: 'packs/common-monsters',
      type: 'Actor',
      system: 'dnd5e',
      ownership: {
        PLAYER: 'NONE',
        ASSISTANT: 'OWNER',
      },
    },
    {
      name: 'common-feats',
      label: '피트',
      path: 'packs/common-feats',
      type: 'Item',
      system: 'dnd5e',
      ownership: {
        PLAYER: 'NONE',
        ASSISTANT: 'OWNER',
      },
    },
    {
      name: 'common-items',
      label: '아이템',
      path: 'packs/common-items',
      type: 'Item',
      system: 'dnd5e',
      ownership: {
        PLAYER: 'NONE',
        ASSISTANT: 'OWNER',
      },
    },
  ]);
  assert.deepEqual(manifest.packFolders, [{
    name: 'NCM',
    sorting: 'a',
    packs: [],
    folders: [{
      name: '공통 데이터',
      sorting: 'a',
      packs: [],
      folders: [{
        name: '크리처',
        sorting: 'a',
        packs: ['common-monsters', 'common-feats', 'common-items'],
        folders: [],
      }],
    }],
  }]);
});
