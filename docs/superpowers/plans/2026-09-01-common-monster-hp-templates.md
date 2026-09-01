# 공통 몬스터 체력 템플릿 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `common-monsters` 모듈 팩에 CR 1~30의 일반·엘리트·보스 D&D5e NPC 기본 액터 90개를 만들고 Foundry에서 로딩한다.

**Architecture:** `module.json`은 `common-monsters` Actor 팩과 `공통` 팩 폴더를 선언한다. Foundry가 생성한 실제 팩 데이터베이스에 폴더와 액터를 기록하며, 저장소의 Node 테스트는 매니페스트·체력 중앙값·팩 데이터의 구조를 검증한다.

**Tech Stack:** Foundry VTT 13.351, D&D5e 5.2.4, Foundry Compendium UI, Node.js 내장 테스트 러너

**Spec:** `docs/superpowers/specs/2026-09-01-nihil-compendium-module-design.md`

## Global Constraints

- `common-monsters`는 Actor 팩이며 `system`은 `dnd5e`다.
- 팩 내부 폴더는 `일반`, `엘리트`, `보스` 세 개다.
- 액터 명명은 `<등급> CR <1~30>`이며 총 90개다.
- HP는 룰북 요청 지침서의 등급별 범위 평균을 올림한다.
- 실제 팩 데이터베이스는 Foundry를 통해서만 생성한다.

---

### Task 1: 매니페스트와 HP 기준 검증

**Files:**
- Modify: `module.json`
- Modify: `tests/module-manifest.test.mjs`
- Create: `tests/common-monster-templates.test.mjs`

**Interfaces:**
- Produces: `common-monsters` 모듈 팩 선언과 CR별 HP 기준 배열

- [ ] **Step 1: 실패 테스트 작성**

`tests/common-monster-templates.test.mjs`에서 CR 1~30, 세 등급, 총 90개와 CR 1·15·30의 HP 중앙값을 검증한다. `module.json`에는 아직 팩이 없으므로 테스트는 실패해야 한다.

- [ ] **Step 2: 실패 확인**

Run: `node --test tests/common-monster-templates.test.mjs`

Expected: `common-monsters` 팩 선언 부재로 FAIL.

- [ ] **Step 3: 최소 구현**

`module.json`에 다음 팩과 상위 폴더를 선언하고, 테스트에 지침 기준 HP 중앙값을 추가한다.

```json
{
  "name": "common-monsters",
  "label": "공통 몬스터",
  "path": "packs/common-monsters",
  "type": "Actor",
  "system": "dnd5e",
  "ownership": { "PLAYER": "NONE", "ASSISTANT": "OWNER" }
}
```

- [ ] **Step 4: 통과 확인**

Run: `node --test tests/module-manifest.test.mjs tests/common-monster-templates.test.mjs`

Expected: PASS.

### Task 2: Foundry에서 실제 팩·폴더·액터 작성

**Files:**
- Create: `packs/common-monsters/` (Foundry 생성 데이터베이스)

**Interfaces:**
- Consumes: Task 1의 팩 선언과 HP 기준
- Produces: `common-monsters` 내 3개 폴더와 90개 D&D5e NPC 액터

- [ ] **Step 1: Foundry에서 팩 초기화**

모듈을 다시 로드해 선언된 `공통 몬스터` 팩을 Compendium 탭에 표시한다. Foundry가 팩 데이터베이스를 생성한 뒤에만 다음 단계로 진행한다.

- [ ] **Step 2: 폴더 생성**

`일반`, `엘리트`, `보스` Actor 폴더를 만든다.

- [ ] **Step 3: 액터 입력**

각 폴더에 CR 1~30 NPC 액터를 만들고, 이름·CR·현재 HP·최대 HP를 기준값으로 입력한다.

- [ ] **Step 4: 구조 검증**

Foundry UI에서 팩·폴더·액터를 다시 열어 총 90개와 CR 1·15·30의 이름·CR·HP를 확인한다.

### Task 3: 저장소 검증·문서·커밋

**Files:**
- Modify: `packs/README.md`
- Modify: `docs/README.md`
- Modify: `tests/common-monster-templates.test.mjs`

**Interfaces:**
- Consumes: Task 1·2의 팩 선언과 실제 데이터베이스
- Produces: 재현 가능한 구조 검증과 사용 문서

- [ ] **Step 1: 팩 데이터 구조 테스트 작성**

Foundry가 작성한 데이터베이스에 3개 폴더, 90개 액터, CR 1·15·30의 기준 HP가 들어 있는지 검증한다.

- [ ] **Step 2: 전체 검증**

Run: `node --test tests/*.test.mjs; git diff --check; git status --short`

Expected: 모든 테스트 PASS, 공백 오류 없음, 예상 변경만 표시.

- [ ] **Step 3: 로딩 검증**

Foundry VTT 13.351 D&D5e 5.2.4 월드의 Compendium 탭에서 `공통 > 공통 몬스터` 팩과 3개 하위 폴더, 90개 액터를 확인한다.

- [ ] **Step 4: 커밋·푸시**

Run: `git add module.json packs docs tests && git commit -m "2026 0901 feat: 공통 몬스터 CR 체력 템플릿 추가" && git push origin master`
