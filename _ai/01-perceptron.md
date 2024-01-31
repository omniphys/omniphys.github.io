---
title: "퍼셉트론"
permalink: /ai/perceptron/
excerpt: "퍼셉트론에 대해서 알아보자."
last_modified_at: 2024-01-31
toc: true
toc_sticky: true
---

**"과학은 여전히 밝혀낸 것보다 밝혀낼 게 더 많다. 뇌과학만 해도 그렇다." - 정재승**
{: .notice--info}

## 1. 퍼셉트론의 등장
과학자들은 오랫동안 인간의 두뇌에서 영감을 받아왔습니다. 인공지능을 설계하기 위해 1943년 신경과학자인 Warren S. McCulloch와 논리학자인 Walter Pitts가 처음으로 간소화된 뇌의 뉴런 개념을 적용한 인공 신경망<sup>[1](#footnote_1)</sup>을 제안하였습니다. 

!["맥컬록-피츠 뉴런"](/assets/images/mcp_neuron.jpg){: .align-center width="100%" height="100%"}
*맥컬록-피츠가 제안한 최초의 인공신경망 개념*

이는 신경 세포를 이진 출력을 내는 간단한 논리 회로로 표현했습니다. 수상 돌기에 여러 신호가 도착하면 세포체에서 합쳐지고, 합쳐진 신호가 특정 임계값을 넘으면 출력 신호가 생성되고 축삭 돌기를 통해 전달됩니다. 
!["뇌의 뉴런"](/assets/images/neuron.png){: .align-center width="100%" height="100%"}





<!-- 글 뒷 부분에 -->
<a name="footnote_1">1</a>: [A logical calculus of the ideas immanent in nervous activity](https://pdfs.semanticscholar.org/5272/8a99829792c3272043842455f3a110e841b1.pdf)