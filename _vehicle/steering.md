---
title: "자율 에이전트와 조향"
permalink: /vehicle/steering/
excerpt: "자율 에이전트의 개념과 조향 행동"
last_modified_at: 2024-07-07
toc: true
toc_sticky: true
---

## 1. 자율 에이전트 (Autonomous Agents)
자율 에이전트는 일반적으로 계획된 환경에 의해서 영향을 받는 것이 아니라, 스스로가 환경 내부에서 어떤 행동을 할지 결정하는 객체를 의미합니다. 자율 에이전트에는 다음과 같이 3가지 중요한 구성 요소를 가집니다.

{% capture notice-text1 %}
* 생명체는 주변 환경을 인식하면서 한정된 정보를 활용하여 살아갑니다. 예를 들어 현실 세계의 곤충은 자신 주변의 한정된 시야와 진동, 냄새를 인식하여 생존해나갑니다.
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">자율 에이전트에는 주변 환경을 인식하는 한정된 능력이 있다.</h4>
  {{ notice-text1 | markdownify }}
</div>

{% capture notice-text2 %}
* 행동은 물리학적으로 힘과 운동으로 표현할 수 있으므로 물리 엔진에서 사용했던 수치 해석을 적용할 수 있습니다. 예를 들어 '굉장히 큰 상어가 다가오고 있다'는 정보를 얻었을때 그 개체가 할 수 있는 행동은 반대 방향으로 힘을 주어 최대한 빨리 도망가는 것입니다. 반대로 먹이를 발견한 개체는 먹이 방향으로 이동하기 위한 행동을 취하기 위해 적절한 힘을 작용할 것입니다.   
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">자율 에이전트는 주변 환경으로부터 얻은 정보를 처리하여 행동을 결정한다.</h4>
  {{ notice-text2 | markdownify }}
</div>

{% capture notice-text3 %}
* 여러 개체가 모여있는 집단에서는 대체적으로 명령을 내리는 리더가 존재하지 않습니다. 리더가 없이도 각 개체들이 서로 상호작용하며 지능적이고 구조화된 행동이 나타날 수 있습니다.
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">자율 에이전트는 리더라는 개념이 없다.</h4>
  {{ notice-text3 | markdownify }}
</div>

## 2. 조향력 (Steering Force)
조향력은 자율 에이전트가 행동의 목적을 달성하기 위해 작용하는 힘이라고 생각하면 됩니다. 예를 들어 아래 그림과 같이 이동하던 곤충이 좋아하는 딸기를 발견했을 때 어떻게 조향력을 작용해야 딸기에 도달할 수 있을까요?

!["속도와 목표가 있는 자율 에이전트"](/assets/images/steering_01.png){: .align-center width="80%" height="80%"}

!["목표지점"](/assets/images/steering_02.png){: .align-center width="80%" height="80%"}

!["최대 속도의 제한"](/assets/images/steering_03.png){: .align-center width="80%" height="80%"}

!["조향력의 계산"](/assets/images/steering_04.png){: .align-center width="80%" height="80%"}

!["조향력의 크기에 따른 경로"](/assets/images/steering_05.png){: .align-center width="80%" height="80%"}


<p align="center">
<iframe src="/p5/steering_agent/" width="640" height="240" frameborder="0"></iframe>
</p>

