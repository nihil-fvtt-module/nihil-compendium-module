# Nihil Compendium Module 기본 골격 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Foundry VTT 13.351에서 D&D5e 5.2.4 전용 컨펜디움 모듈로 인식되는 빈 모듈 골격과 공통·룩스테라 에셋 저장소를 만든다.

**Architecture:** 최상단 `module.json`은 모듈 식별자와 D&D5e 시스템 관계만 선언하고, 실제 컨펜디움 데이터베이스는 포함하지 않는다. `packs/`와 에셋 폴더는 Git으로 추적하되, 실제 팩은 Foundry Module Maker가 생성한 후 별도 작업에서 매니페스트에 등록한다.

**Tech Stack:** Foundry VTT 13.351, D&D5e 5.2.4, Node.js 내장 테스트 러너, JSON

**Spec:** `docs/superpowers/specs/2026-09-01-nihil-compendium-module-design.md`

## Global Constraints

- 모듈 ID와 폴더명은 `nihil-compendium-module`로 통일한다.
- Foundry VTT 호환 확인 버전은 `13.351`이며 최소 버전은 `13`이다.
- 모듈은 D&D5e `5.2.4`를 요구하며 `system` 제한과 시스템 관계를 함께 선언한다.
- MIDI-QOL `13.0.31`, DAE `13.0.17`, 자동화 스크립트와 매크로는 포함하지 않는다.
- 실제 컨펜디움 데이터베이스는 Foundry Module Maker로만 생성한다. 빈 SQLite·LevelDB 파일을 수동 생성하지 않는다.
- 에셋은 `common`과 `luxterra` 각각의 `maps`, `items`, `spells`, `portraits`, `tokens`에 보관한다.
- 컨펜디움 데이터와 저작권 또는 사용 권한이 확인되지 않은 D&D 원문은 추가하지 않는다.

---

## 파일 구조

| 파일 또는 경로 | 책임 |
| --- | --- |
| `module.json` | Foundry가 읽는 모듈 식별·호환·D&D5e 제한 선언 |
| `tests/module-manifest.test.mjs` | 매니페스트 형식과 호환 기준 검증 |
| `tests/module-layout.test.mjs` | 빈 모듈 골격의 필수 폴더·문서 검증 |
| `assets/{common,luxterra}/{maps,items,spells,portraits,tokens}/.gitkeep` | 빈 에셋 경로의 Git 추적 |
| `packs/.gitkeep` | Module Maker가 실제 팩을 만들 위치의 Git 추적 |
| `packs/README.md` | Module Maker로 팩을 만든 뒤 매니페스트에 등록하는 절차 |
| `docs/README.md` | 에셋 경로, 팩 ID, 콘텐츠 경계의 빠른 참조 |
| `.gitignore` | 배포 ZIP·운영 로그·편집기 임시 파일 제외 |

### Task 1: Foundry 모듈 매니페스트

**Files:**
- Create: `tests/module-manifest.test.mjs`
- Create: `module.json`

**Interfaces:**
- Consumes: 저장소 루트 폴더명과 Global Constraints
- Produces: Foundry가 읽을 수 있는 `module.json`

- [ ] **Step 1: 매니페스트 검증 테스트 작성**

```js
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
```

- [ ] **Step 2: 테스트가 올바르게 실패하는지 확인**

Run: `node --test tests/module-manifest.test.mjs`

Expected: `module.json`을 찾지 못해 FAIL.

- [ ] **Step 3: 최소 매니페스트 작성**

```json
{
  "id": "nihil-compendium-module",
  "title": "Nihil Compendium Module",
  "description": "D&D5e 공통 및 룩스테라 전용 컨펜디움을 위한 개인 콘텐츠 모듈입니다.",
  "authors": [
    {
      "name": "nihil"
    }
  ],
  "version": "0.1.0",
  "compatibility": {
    "minimum": "13",
    "verified": "13.351"
  },
  "system": [
    "dnd5e"
  ],
  "relationships": {
    "systems": [
      {
        "id": "dnd5e",
        "type": "system",
        "compatibility": {
          "minimum": "5.2.4",
          "verified": "5.2.4"
        }
      }
    ]
  },
  "packs": [],
  "packFolders": []
}
```

- [ ] **Step 4: 매니페스트 테스트와 JSON 해석을 통과하는지 확인**

Run: `node --test tests/module-manifest.test.mjs; node -e "JSON.parse(require('node:fs').readFileSync('module.json', 'utf8'))"`

Expected: 테스트 PASS, 두 번째 명령은 출력 없이 종료 코드 0.

- [ ] **Step 5: 커밋**

```bash
git add module.json tests/module-manifest.test.mjs
git commit -m "2026 0901 feat: D&D5e 컨펜디움 모듈 매니페스트 추가"
```

### Task 2: 에셋·팩 저장소와 작성 지침

**Files:**
- Create: `tests/module-layout.test.mjs`
- Create: `assets/common/maps/.gitkeep`
- Create: `assets/common/items/.gitkeep`
- Create: `assets/common/spells/.gitkeep`
- Create: `assets/common/portraits/.gitkeep`
- Create: `assets/common/tokens/.gitkeep`
- Create: `assets/luxterra/maps/.gitkeep`
- Create: `assets/luxterra/items/.gitkeep`
- Create: `assets/luxterra/spells/.gitkeep`
- Create: `assets/luxterra/portraits/.gitkeep`
- Create: `assets/luxterra/tokens/.gitkeep`
- Create: `packs/.gitkeep`
- Create: `packs/README.md`
- Create: `docs/README.md`
- Create: `.gitignore`

**Interfaces:**
- Consumes: Task 1의 `module.json`, Global Constraints
- Produces: 콘텐츠를 넣을 수 있는 빈 경로와 팩 생성 절차

- [ ] **Step 1: 폴더 구조와 작성 지침의 실패 테스트 작성**

```js
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
```

- [ ] **Step 2: 테스트가 올바르게 실패하는지 확인**

Run: `node --test tests/module-layout.test.mjs`

Expected: 아직 존재하지 않는 `assets` 또는 `packs` 경로 때문에 FAIL.

- [ ] **Step 3: 빈 저장소와 문서 작성**

`packs/README.md`에는 Module Maker에서 아래 팩을 한 개씩 만들고, 생성된 실제 팩 경로와 동일한 `name`, `path`, `type`, `system` 값을 `module.json`에 등록한다고 적는다.

```text
common-monsters      Actor
common-items         Item
common-spells        Item
common-species       Item
common-rolltables    RollTable
luxterra-monsters    Actor
luxterra-npcs        Actor
luxterra-items       Item
luxterra-spells      Item
luxterra-species     Item
luxterra-journals    JournalEntry
luxterra-scenes      Scene
luxterra-rolltables  RollTable
```

`docs/README.md`에는 다음을 기록한다.

- `portraits`는 저널·액터 소개용 인물 이미지이고 `tokens`는 맵 전투용 정사각형 이미지다.
- 공통은 세계관 비종속 D&D5e 데이터, 룩스테라는 고유 설정 데이터다.
- 에셋 참조 경로는 `modules/nihil-compendium-module/assets/<scope>/<type>/...` 형식을 사용한다.
- 저작권 또는 사용 권한이 확인되지 않은 D&D 원문을 추가하지 않는다.

`.gitignore`에는 `*.zip`, `logs/`, `.DS_Store`, `Thumbs.db`만 추가한다. `packs/`와 `assets/`는 무시하지 않는다.

- [ ] **Step 4: 구조 테스트를 통과하는지 확인**

Run: `node --test tests/module-layout.test.mjs`

Expected: PASS.

- [ ] **Step 5: 전체 골격 검증**

Run: `node --test tests/*.test.mjs; git diff --check; git status --short`

Expected: 두 테스트 파일 모두 PASS, `git diff --check`는 출력 없음, 예상한 신규 파일만 표시.

- [ ] **Step 6: 커밋**

```bash
git add .gitignore assets packs docs/README.md tests/module-layout.test.mjs
git commit -m "2026 0901 feat: 컨펜디움 에셋과 팩 작성 골격 추가"
```

### Task 3: Foundry VTT 수동 로딩 검증

**Files:**
- Modify: `docs/README.md`

**Interfaces:**
- Consumes: Task 1의 설치 가능한 `module.json`, Task 2의 Module Maker 안내
- Produces: 실제 Foundry에서 확인한 모듈 골격 검증 기록

- [ ] **Step 1: 수동 검증 체크리스트 작성**

`docs/README.md`에 다음 체크리스트를 추가한다.

```markdown
## Foundry VTT 13.351 검증

- [ ] `nihil-compendium-module` 폴더를 Foundry 사용자 데이터의 `Data/modules/` 아래에 둔다.
- [ ] D&D5e 5.2.4 월드를 열고 모듈 관리에서 `Nihil Compendium Module`을 활성화한다.
- [ ] 콘솔에 매니페스트 또는 시스템 호환 오류가 없는지 확인한다.
- [ ] Module Maker로 팩 하나를 만들고, 그것이 Compendium 탭에 표시되는지 확인한다.
```

- [ ] **Step 2: 문서 변경 형식을 확인**

Run: `git diff --check; node --test tests/*.test.mjs`

Expected: `git diff --check` 출력 없음, 전체 테스트 PASS.

- [ ] **Step 3: 커밋**

```bash
git add docs/README.md
git commit -m "2026 0901 docs: Foundry 모듈 로딩 검증 절차 추가"
```

## Self-Review

- Spec coverage: 모듈 ID, Foundry·D&D5e 버전, 공통·룩스테라 5종 에셋 분리, Module Maker 팩 생성 원칙, 초기 13개 팩 목록, 자동화 제외, 저작권 경계, 테스트와 Foundry 수동 검증을 각각 Task 1~3에 배정했다.
- Placeholder scan: 계획의 명령, 파일 경로, 검증 기준과 초기 팩 ID를 모두 구체화했다.
- Type consistency: 모든 Node 테스트는 ESM `.mjs`와 `node --test`를 사용하며 `repositoryRoot` 계산 방식을 동일하게 사용한다.
