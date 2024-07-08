---
title: "도착 및 배회"
permalink: /vehicle/arrive/
excerpt: "자율 에이전트의 도착 및 배회 행동"
last_modified_at: 2024-07-08
toc: true
toc_sticky: true
---

## 1. 도착 행동
자율 에이전트가 목표를 향해 움직이다가 목표에 가까워질수록 속도를 줄여야 하는 상황이 되면 어떻게 해야 할까요? 예를 들어 꽃을 발견한 벌이 꽃에 앉기 위해서는 꽃과의 거리와 속도를 고려해야 합니다. 그렇지 않으면 목표물을 지나치고 말테니까요. 목표를 발견하고 도달하는 과정에서 자율 에이전트의 머리 속의 사고 과정을 나타내면 다음과 같을 것 입니다. 

!["도착행동"](/assets/images/arrive_01.png){: .align-center width="80%" height="80%"}

> 1. 많이 멀잖아! 가능한 한 빠르게 목표를 찾아 움직여야 해!
> 2. 그래도 조금 멀잖아! 가능한 한 빠르게 목표를 찾아 움직여야 해! 
> 3. 조금 가까워 졌으니 조금 느리게 접근하자!
> 4. 곧 도착이다! 가능한 한 느리게 접근하자!
> 5. 도착했다! 정지!

!["도착행동"](/assets/images/arrive_02.png){: .align-center width="80%" height="80%"}


!["도착행동"](/assets/images/arrive_03.png){: .align-center width="80%" height="80%"}

