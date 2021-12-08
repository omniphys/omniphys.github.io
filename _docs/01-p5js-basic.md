---
title: "p5.js 시작하기"
permalink: /p5js-basic/
excerpt: "p5.js에 대해서 알아봅시다."
last_modified_at: 2021-03-23
toc: true
toc_sticky: true
---

안녕하세요. 여러분.

이 웹페이지는 여러분들이 원격 수업 기간동안 자바스크립트를 이용해 물리 엔진 제작 실습을 위해 만들어졌습니다

우리가 사용하려는 p5.js 자바스크립트 라이브러리는 웹에서 시뮬레이션, 애니메이션을 쉽게 만들기 위해 여러 기능을 제공합니다.

물리 엔진을 만드는 과정을 통해 물리학2 수업 시간에 배운 여러 물리 개념을 실제로 적용해 보는데 그 의미가 있습니다.

2주간의 이 과정은 여러분이 웹페이지를 한단계 한단계 따라가면서 실습을 하고 최종에는 프로젝트를 완성하는 과정으로 진행됩니다.

그럼 첫 시간을 힘내서 시작해 볼까요?

## 1. p5.js 시작하기

p5.js의 구조는 크게 setup() 함수와 draw() 함수로 구성되어 있습니다.

```javascript
function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}
```

setup() 함수는 프로그램이 시작되면 맨처음 한번 실행되는 함수입니다. 이 함수 안에는 캔버스 크기나 각종 초기값들을 설정합니다.

setup() 함수 안의 createCanvas(x,y) 함수는 화면에 그려질 캔버스의 크기를 픽셀 단위로 지정하는 명령입니다.

draw() 함수는 setup() 함수 이후에 무한 반복(1초에 30프레임~60프레임)되는 함수입니다. 이 함수 안에는 이미지나 에니메이션을 보여주는 기능을 넣넣습니다. 

draw() 함수 안의 background(color) 함수는 캔버스의 배경색을 설정합니다. color는 0~255값의 RGB값과 alpha값으로 표현합니다. 

예를 들면 background(255,0,0) 이나 background('red')는 배경색을 빨간색을 지정한 것을 나타냅니다.

background(200) 처럼 하나의 값만 넣을 경우 그레이 계열의 색으로 지정됩니다.

background() 함수가 draw() 함수 안에 있으면 반복될때마다 캔버스를 해당색으로 초기화해주는 역할을 합니다.

소개한 함수 외에 추가 기능을 클래스나 함수로 만들 수 있으며, setup()함수와 draw()함수는 필수적으로 포함되어야 하는 함수입니다.

> ### 활동 1. 직접 캔버스의 크기와 배경색을 변경해봅시다.

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
function setup() {
  createCanvas(100, 100);
}

function draw() {
  background(220); // background(255,0,0); 또는 background('red')으로 수정해 보세요.
}
</script>

[* 문법 참고](https://p5js.org/ko/reference/#/p5/background){:target="_blank"}


## 2. 도형 그리기

이번에는 캔버스에 타원, 사각형 같은 도형을 그려보도록 하겠습니다.

타원을 그릴 때는 ellipse(x,y,w,h) 함수를 이용합니다. x,y는 타원의 좌표, w는 타원의 너비, h는 타원의 높이를 의미합니다.

사각형을 그릴 때는 rect(x,y,w,h) 함수를 이용합니다. 마찬가지로 x,y는 사각형의 좌표, w는 사각형 너비, h는 사각형의 높이를 의미합니다.

도형의 색을 칠할 때는 fill(color) 함수를 이용합니다. 이 때 fill 함수 뒤에 따라오는 도형에만 해당 색이 적용됩니다.

> ### 활동 2. 캔버스에 타원과 사각형을 그려봅시다.

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
function setup() {
  createCanvas(100, 100);
}

function draw() {
  background(220); 
  fill(255,255,0);
  ellipse(50,50,20,10);
}
</script>


## 3. 눈사람 그리기

이번에는 캔버스에 타원, 사각형 함수를 이용하여 다음과 같은 눈사람을 그려봅시다.

!["눈사람"](/assets/images/snowman.png)

보기의 눈사람에 눈과 코, 입까지 그려본다면 더 멋진 눈사람이 완성되겠죠?

> ### 활동 3. 캔버스에 눈사람을 그려봅시다.

<script src="//toolness.github.io/p5.js-widget/p5-widget.js"></script>
<script type="text/p5" data-height="500" data-p5-version="1.2.0">
function setup() {
  createCanvas(100, 100);
}

function draw() {
  background(220); 
  
  
}
</script>
