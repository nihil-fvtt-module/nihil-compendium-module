/**
 * Foundry 매크로로 실행해 공통 몬스터 팩을 최초 생성한다.
 * 이미 채워진 팩에서는 실행하지 않는다.
 */

const PACK_ID = 'nihil-compendium-module.common-monsters';
const MODULE_ID = 'nihil-compendium-module';
const FOLDER_NAMES = ['일반', '엘리트', '보스'];

const pack = game.packs.get(PACK_ID);

if (!pack) {
  throw new Error(`컴펜디엄 팩을 찾을 수 없습니다: ${PACK_ID}`);
}

if (pack.index.size > 0 || pack.folders.size > 0) {
  throw new Error('공통 몬스터 팩이 비어 있지 않습니다. 중복 생성을 방지하기 위해 중단했습니다.');
}

const response = await fetch(
  `modules/${MODULE_ID}/data/common-monster-templates.json`,
);

if (!response.ok) {
  throw new Error(`템플릿 데이터를 읽지 못했습니다: ${response.status}`);
}

const templates = await response.json();

if (templates.length !== 90) {
  throw new Error(`템플릿 수가 올바르지 않습니다: ${templates.length}`);
}

await pack.configure({ locked: false });

try {
  const folders = await Folder.implementation.createDocuments(
    FOLDER_NAMES.map((name) => ({ name, type: 'Actor' })),
    { pack: PACK_ID },
  );
  const folderIds = new Map(folders.map((folder) => [folder.name, folder.id]));
  const actors = templates.map((template) => ({
    name: template.name,
    type: 'npc',
    folder: folderIds.get(template.folder),
    system: {
      details: {
        cr: template.cr,
      },
      attributes: {
        hp: {
          value: template.hp,
          max: template.hp,
          formula: `${template.hp}`,
        },
      },
    },
  }));

  await Actor.implementation.createDocuments(actors, { pack: PACK_ID });
} finally {
  await pack.configure({ locked: true });
}

ui.notifications.info('공통 몬스터 템플릿 90개를 생성했습니다.');
