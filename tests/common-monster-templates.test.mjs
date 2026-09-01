import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const hpByCr = {
  1: { normal: 25, elite: 45, boss: 80 },
  2: { normal: 40, elite: 68, boss: 108 },
  3: { normal: 53, elite: 90, boss: 145 },
  4: { normal: 65, elite: 110, boss: 185 },
  5: { normal: 80, elite: 135, boss: 230 },
  6: { normal: 93, elite: 158, boss: 280 },
  7: { normal: 108, elite: 180, boss: 330 },
  8: { normal: 125, elite: 203, boss: 380 },
  9: { normal: 143, elite: 225, boss: 430 },
  10: { normal: 160, elite: 255, boss: 480 },
  11: { normal: 180, elite: 290, boss: 535 },
  12: { normal: 200, elite: 325, boss: 595 },
  13: { normal: 220, elite: 360, boss: 655 },
  14: { normal: 240, elite: 395, boss: 715 },
  15: { normal: 260, elite: 430, boss: 775 },
  16: { normal: 280, elite: 465, boss: 835 },
  17: { normal: 300, elite: 500, boss: 895 },
  18: { normal: 320, elite: 535, boss: 955 },
  19: { normal: 340, elite: 570, boss: 1015 },
  20: { normal: 360, elite: 605, boss: 1075 },
  21: { normal: 380, elite: 640, boss: 1135 },
  22: { normal: 400, elite: 675, boss: 1195 },
  23: { normal: 420, elite: 710, boss: 1255 },
  24: { normal: 440, elite: 745, boss: 1315 },
  25: { normal: 460, elite: 780, boss: 1375 },
  26: { normal: 480, elite: 815, boss: 1435 },
  27: { normal: 500, elite: 850, boss: 1495 },
  28: { normal: 520, elite: 885, boss: 1555 },
  29: { normal: 540, elite: 920, boss: 1615 },
  30: { normal: 570, elite: 975, boss: 1700 },
};

test('common monster pack declares the three CR HP template tiers', async () => {
  const manifest = JSON.parse(
    await readFile(path.join(repositoryRoot, 'module.json'), 'utf8'),
  );
  const pack = manifest.packs.find(({ name }) => name === 'common-monsters');

  assert.deepEqual(pack, {
    name: 'common-monsters',
    label: '공통 몬스터',
    path: 'packs/common-monsters',
    type: 'Actor',
    system: 'dnd5e',
    ownership: {
      PLAYER: 'NONE',
      ASSISTANT: 'OWNER',
    },
  });
  assert.equal(Object.keys(hpByCr).length, 30);
  assert.deepEqual(hpByCr[1], { normal: 25, elite: 45, boss: 80 });
  assert.deepEqual(hpByCr[15], { normal: 260, elite: 430, boss: 775 });
  assert.deepEqual(hpByCr[30], { normal: 570, elite: 975, boss: 1700 });
});

test('common monster seed data has one NPC template per tier and CR', async () => {
  const templates = JSON.parse(
    await readFile(
      path.join(repositoryRoot, 'data', 'common-monster-templates.json'),
      'utf8',
    ),
  );

  assert.equal(templates.length, 90);
  assert.deepEqual(templates.at(0), {
    name: '일반 CR 1',
    folder: '일반',
    cr: 1,
    hp: 25,
  });
  assert.deepEqual(templates.at(-1), {
    name: '보스 CR 30',
    folder: '보스',
    cr: 30,
    hp: 1700,
  });

  for (const [cr, hp] of Object.entries(hpByCr)) {
    const expectedCr = Number(cr);

    assert(templates.some((template) => (
      template.name === `일반 CR ${expectedCr}`
      && template.folder === '일반'
      && template.cr === expectedCr
      && template.hp === hp.normal
    )));
    assert(templates.some((template) => (
      template.name === `엘리트 CR ${expectedCr}`
      && template.folder === '엘리트'
      && template.cr === expectedCr
      && template.hp === hp.elite
    )));
    assert(templates.some((template) => (
      template.name === `보스 CR ${expectedCr}`
      && template.folder === '보스'
      && template.cr === expectedCr
      && template.hp === hp.boss
    )));
  }
});
