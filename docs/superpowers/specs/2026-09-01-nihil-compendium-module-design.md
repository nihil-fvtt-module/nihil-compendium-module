# Nihil Compendium Module 기본 구조 설계

## 목적

`nihil-compendium-module`은 Foundry VTT 13.351 및 D&D5e 5.2.4에서 사용하는 개인용 콘텐츠 모듈이다. 이 모듈은 세계관 비종속 D&D5e 공통 데이터와 룩스테라 전용 데이터를 독립 컨펜디움 팩으로 제공한다.

MIDI-QOL 13.0.31과 DAE 13.0.17은 현재 호환 기준으로만 기록한다. 초기 모듈의 필수 의존성으로 등록하거나 자동화 스크립트를 포함하지 않는다.

## 모듈 경계

- 모듈 ID와 폴더명은 `nihil-compendium-module`로 통일한다.
- 최상단 `module.json`은 D&D5e 시스템 의존성과 Foundry VTT 13.351 호환 범위를 선언한다.
- 컨펜디움은 모듈이 소유하며, 월드에 복사된 문서의 후속 수정은 모듈 데이터와 분리된다.
- 룩스테라 고유 콘텐츠는 공통 팩에 넣지 않는다.
- 저작권 또는 사용 권한이 확인되지 않은 D&D 원문 데이터는 포함하지 않는다.

## 디렉터리 구조

```text
nihil-compendium-module/
├─ module.json
├─ packs/
├─ assets/
│  ├─ common/
│  │  ├─ maps/
│  │  ├─ items/
│  │  ├─ spells/
│  │  ├─ portraits/
│  │  └─ tokens/
│  └─ luxterra/
│     ├─ maps/
│     ├─ items/
│     ├─ spells/
│     ├─ portraits/
│     └─ tokens/
├─ docs/
│  ├─ superpowers/specs/
│  └─ README.md
└─ .gitignore
```

- `portraits`는 저널·액터 소개에 쓰는 인물 포트레이트를, `tokens`는 맵 위 전투에 쓰는 정사각형 토큰을 보관한다.
- 에셋 참조는 항상 모듈 루트를 기준으로 하는 `modules/nihil-compendium-module/assets/...` 경로를 사용한다.
- `packs/`의 실제 데이터베이스는 Foundry Module Maker로 만든다. 빈 SQLite·LevelDB 파일을 수동 생성하지 않는다.

## 초기 컨펜디움 팩 설계

| 분류 | 팩 ID | 문서 유형 | 역할 |
| --- | --- | --- | --- |
| 공통 | `common-monsters` | Actor | 세계관 비종속 몬스터 |
| 공통 | `common-items` | Item | 무기·장비·소모품·전리품 |
| 공통 | `common-spells` | Item | 주문 |
| 공통 | `common-species` | Item | 종족과 종족 특성 |
| 공통 | `common-rolltables` | RollTable | 무작위 표 |
| 룩스테라 | `luxterra-monsters` | Actor | 룩스테라 고유 몬스터 |
| 룩스테라 | `luxterra-npcs` | Actor | 룩스테라 NPC |
| 룩스테라 | `luxterra-items` | Item | 룩스테라 고유 아이템 |
| 룩스테라 | `luxterra-spells` | Item | 룩스테라 고유 주문 |
| 룩스테라 | `luxterra-species` | Item | 룩스테라 고유 종족과 종족 특성 |
| 룩스테라 | `luxterra-journals` | JournalEntry | 설정·장소·NPC 설명 |
| 룩스테라 | `luxterra-scenes` | Scene | 전투·탐사 장면 |
| 룩스테라 | `luxterra-rolltables` | RollTable | 룩스테라 전용 무작위 표 |

## 팩 표시와 접근 규칙

- `module.json`의 `packFolders`는 `공통`과 `룩스테라`를 최상위 폴더로 표시한다.
- 초기 팩은 GM과 보조 GM이 편집할 수 있고 플레이어에게는 표시하지 않는다.
- 룩스테라 저널·씬의 공개 여부는 모듈 전역 설정이 아니라 각 월드에서 필요할 때 조정한다.

## 검증 기준

1. `module.json`이 유효한 JSON이며 ID가 폴더명과 일치한다.
2. 모듈을 Foundry VTT 13.351에 설치했을 때 모듈 목록에 표시되고 활성화된다.
3. Module Maker로 만든 모든 팩이 올바른 문서 유형과 D&D5e 시스템을 사용한다.
4. 공통·룩스테라 팩이 Compendium 탭의 각 폴더에 분리되어 표시된다.
5. 샘플 Actor·Item·Scene이 각각 대응하는 에셋 경로를 해석한다.

## 범위 밖

- MIDI-QOL·DAE 자동화 및 매크로
- 컨펜디움 실제 콘텐츠 작성·변환
- 배포용 릴리스, 원격 저장소 푸시, 자동 업데이트 매니페스트
- 월드 생성 및 월드별 권한 설정
