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
* 생명체는 주변 환경을 인식하면서 한정된 정보를 활용하여 살아간다. 예를 들어 현실 세계의 곤충은 자신 주변의 한정된 시야와 진동, 냄새를 인식하여 생존해나간다.
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">자율 에이전트에는 주변 환경을 인식하는 한정된 능력이 있다.</h4>
  {{ notice-text1 | markdownify }}
</div>
