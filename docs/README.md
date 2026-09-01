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
