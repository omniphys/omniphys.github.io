---
title: "공룡 게임 만들기 3 - 충돌 감지 구현"
permalink: /games/trex_03/
excerpt: "p5.js로 게임을 만들어 봅시다"
last_modified_at: 2021-10-25
toc: true
toc_sticky: true
---

이번 시간에는 크롬 공룡 게임에서 엔딩 조건을 구현해 보겠습니다. 아래 화면처럼 크롬 공룡 게임은 공룡이 달리다가 선인장 모양의 장애물과 충돌하면 게임이 끝나게 되어 있습니다. 

!["공룡 게임 화면"](/assets/images/trex_game_02.png){: .align-center width="100%" height="100%"}

우리는 앞서서 공룡의 점프 기능과 장애물을 생성하여 이동시키는 과정까지 구현해 보았습니다. 게임 엔딩 조건 구현을 위해서 공룡과 장애물 사이에 충돌 감지 기능을 추가하도록 하겠습니다.