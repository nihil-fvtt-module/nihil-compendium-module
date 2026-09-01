# Nihil Compendium Module 작성 기준

## 데이터 범위

- `common`은 세계관 비종속 D&D5e 데이터다.
- `luxterra`는 룩스테라 고유 설정 데이터다.
- 저작권 또는 사용 권한이 확인되지 않은 D&D 원문은 추가하지 않는다.

## 에셋 경로

| 경로 | 용도 |
| --- | --- |
| `assets/<scope>/maps/` | 씬과 맵에 쓰는 이미지 |
| `assets/<scope>/items/` | 아이템 이미지 |
| `assets/<scope>/spells/` | 주문 이미지 |
| `assets/<scope>/portraits/` | 저널·액터 소개용 인물 포트레이트 |
| `assets/<scope>/tokens/` | 맵 전투용 정사각형 토큰 |

Foundry 문서에서 에셋을 참조할 때는 `modules/nihil-compendium-module/assets/<scope>/<type>/...` 형식을 사용한다.

## 컨펜디움 팩

실제 팩 생성과 `module.json` 등록 방법은 [packs/README.md](../packs/README.md)를 따른다.

## Foundry VTT 13.351 검증

- [ ] `nihil-compendium-module` 폴더를 Foundry 사용자 데이터의 `Data/modules/` 아래에 둔다.
- [ ] D&D5e 5.2.4 월드를 열고 모듈 관리에서 `Nihil Compendium Module`을 활성화한다.
- [ ] 콘솔에 매니페스트 또는 시스템 호환 오류가 없는지 확인한다.
- [ ] Module Maker로 팩 하나를 만들고, 그것이 Compendium 탭에 표시되는지 확인한다.
