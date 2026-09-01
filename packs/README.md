# 컨펜디움 팩 관리

실제 컨펜디움 데이터베이스는 빈 파일을 수동 생성하지 않고 Foundry VTT 13.351의 Module Maker에서 만듭니다.

1. 모듈을 Foundry 사용자 데이터의 `Data/modules/nihil-compendium-module`에 둡니다.
2. D&D5e 5.2.4 월드에서 Module Maker를 열고 이 모듈을 선택합니다.
3. 아래 목록의 팩을 하나씩 생성합니다.
4. 생성된 팩의 `name`, `path`, `type`, `system`을 `module.json`의 `packs`에 기록합니다.
5. `common-*` 팩은 `공통`, `luxterra-*` 팩은 `룩스테라` `packFolders`에 등록합니다.

| 팩 ID | 문서 유형 | 범위 |
| --- | --- | --- |
| `common-monsters` | Actor | 세계관 비종속 몬스터 |
| `common-items` | Item | 세계관 비종속 아이템 |
| `common-spells` | Item | 세계관 비종속 주문 |
| `common-species` | Item | 세계관 비종속 종족과 종족 특성 |
| `common-rolltables` | RollTable | 세계관 비종속 무작위 표 |
| `luxterra-monsters` | Actor | 룩스테라 고유 몬스터 |
| `luxterra-npcs` | Actor | 룩스테라 NPC |
| `luxterra-items` | Item | 룩스테라 고유 아이템 |
| `luxterra-spells` | Item | 룩스테라 고유 주문 |
| `luxterra-species` | Item | 룩스테라 고유 종족과 종족 특성 |
| `luxterra-journals` | JournalEntry | 설정·장소·NPC 설명 |
| `luxterra-scenes` | Scene | 전투·탐사 장면 |
| `luxterra-rolltables` | RollTable | 룩스테라 전용 무작위 표 |

Actor와 Item 팩에는 `system: "dnd5e"`를 설정합니다. MIDI-QOL과 DAE는 이 기본 모듈의 필수 의존성이 아닙니다.
