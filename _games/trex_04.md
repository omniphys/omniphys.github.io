---
title: "공룡 게임 만들기 4 - 이미지, 사운드 추가하기"
permalink: /games/trex_04/
excerpt: "p5.js로 게임을 만들어 봅시다"
last_modified_at: 2021-10-27
toc: true
toc_sticky: true
---

지난 수업까지는 게임의 기본 기능을 구현하는데 집중했다면 이번 시간에는 우리가 만든 게임을 좀 더 게임답게 꾸며보는 과정을 진행하도록 하겠습니다. 

무엇보다도 게임의 재미를 주는 것은 멋있는 그래픽과 음향효과이니까요! 

이번 수업에서는 단순히 원과 직사각형으로 표현했던 공룡과 장애물을 이미지로 대체하고, 공룡이 점프할 때 효과음을 추가해 좀 더 실감나는 게임을 구현해 보도록 하겠습니다.

!["공룡 게임 이미지"](/assets/images/trex_game_img.png){: .align-center width="100%" height="100%"}

## 1. p5.js 웹에디터를 이용하여 파일 추가하기

이번 수업부터는 이미지 파일, 소리 파일과 같이 외부 파일을 사용하기 때문에 실습사이트 내에서 바로 코딩을 했던 p5.js위젯을 사용하지 못하고 p5.js 웹에디터로 실습을 해야 합니다. 

아래와 같이 외부 파일을 사용하기 위해서는 몇가지 단계를 거쳐야 합니다.

> 1. 웹브라우저에서 [p5.js 웹에디터](https://editor.p5js.org/){:target="_blank"}를 실행시킵니다.
> 2. p5.js 웹에디터의 화살표 버튼을 누르면 실제 프로그램에서 사용되는 index.html, sketch.js, style.css 파일들을 볼 수 있습니다.
!["웹에디터"](/assets/images/webeditor1.png){: .align-center width="100%" height="100%"}
> 3. 웹에디터에 아래 사진과 같이 이미지, 사운드 파일을 넣을 'asset' 이라는 폴더를 만들어 줍니다.
> 4. 게임에서 사용할 이미지, 사운드 파일을 다운로드 버튼을 눌러 다운받아 압축을 풉니다. <a href="/assets/images/trex_game_asset.zip" class="btn btn--primary">이미지, 사운드 파일 다운받기</a>
> 5. 'asset' 폴더에 해당 파일들을 드래그하여 업로드하면 사진과 같이 파일들이 추가된 것을 확인할 수 있습니다.
!["웹에디터"](/assets/images/webeditor2.png){: .align-center width="100%" height="100%"}

{% capture notice-text %}
p5.js 기본 파일의 역할은 다음과 같습니다.
* index.html : 웹페이지에서 기본적으로 보여지는 문서 파일입니다. 이 파일안에 sketch.js, style.css 등 웹페이지에 필요한 파일들이 링크되어 있습니다. 
* sketch.js : 동적인 기능들이 자바스크립트로 구현되는 파일로서 지금까지 여러분이 코딩했던 파일입니다.
* style.css : 문서에서 글자크기, 폰트, 색 등 스타일을 지정해주는 파일입니다.
{% endcapture %}
<div class="notice--warning">
  <h4 class="no_toc">추가 설명</h4>
  {{ notice-text | markdownify }}
</div>

## 2. 이미지, 사운드 파일 사용하기

이제 업로드한 이미지, 사운드 파일을 프로그램에서 사용할 수 있도록 불러오는 명령어를 알아보도록 하겠습니다.

이떄 아래와 같이 preload()함수안에 loadImage(), loadSound()를 사용하여 미리 메모리에 로딩을 합니다.

preload() 함수는 setup()함수보다 먼저 실행되는 함수로 불러오기가 완료될 때까지 다음 단계로 넘어가지 않게 해줍니다.

그리고 실제로 이미지와 사운드를 사용할 때는 image(), sound.play()함수를 사용합니다.

```javascript
function preload() {
  dinoRun_1 = loadImage('asset/dino_run1.png');
  dinoRun_2 = loadImage('asset/dino_run2.png');
  dinoJump = loadImage('asset/dino_jump.png');
  cactusImg = loadImage('asset/cactus.png');
  dinoDead = loadImage('asset/dino_dead.png');
  cloudImg = loadImage('asset/cloud.png');
  
  jumpSound = loadSound('asset/jump.wav');
}

function setup() {
  createCanvas(400, 200); // 이제 실제 게임처럼 캔버스 크기를 좀 키워 봅시다.
  tRex = new Dino(width/10, height, 8, 20); // 공룡의 위치, 무게, 크기도 바꿔봅시다.
}

class Dino {
  ...
  jump() {
    if (this.pos.y == height - this.r) {
      this.vel.y = jumpVelocity;
      jumpSound.play(); // 점프 사운드 플레이
    }
  }
  show() {
    imageMode(CENTER);  // 이미지 위치를 가운데 기준으로 설정함.
    if (frameCount % 4 == 0 || frameCount % 4 == 1)
      image(dinoRun_1, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    else
      image(dinoRun_2, this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    // 기존 원모양의 공룡 대신에 이미지로 대치
    //ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

class Obstacle{
  ...
  show() {
    imageMode(CORNER);  // 이미지 위치를 왼쪽 모서리 기준으로 설정함.
    image(cactusImg, this.x, this.y, this.w, this.h);
    // 기존 직사각형 모양의 장애물 대신에 이미지로 대치
    //rect(this.x, this.y, this.w, this.h);
  }
}
```

[* preload() 문법 참고](https://p5js.org/ko/reference/#/p5/preload){:target="_blank"}

[* image() 문법 참고](https://p5js.org/ko/reference/#/p5/image){:target="_blank"}

[* sound.play() 문법 참고](https://p5js.org/ko/reference/#/p5.SoundFile/play){:target="_blank"}

위의 코드를 활용하여 지난 시간에 작성했던 코드들을 수정해서 적용해 보고 공룡과 장애물의 크기와 속도값 등을 조절해서 더 그럴듯한 움직임을 만들어 보세요.

코드를 어떻게 짜야 할지 혹시 잘 모르겠으면 선생님이 만든 코드를 참고하세요. 그래도 여러분이 스스로 마지막까지 직접 해내시는 것을 권장합니다.

[* 선생님의 공룡 게임 코드](https://editor.p5js.org/physics-mulberry/sketches/NwwwHLWH6){:target="_blank"}

자! 오늘은 드디어 공룡 게임을 게임답게 꾸며 보았습니다. 이제야 우리가 정말 게임을 만든 것 같은 느낌이 들 것입니다.

추가적으로 게임의 완성도를 높이기 위해 아래 과제를 해결해 봅시다.

> 오늘의 과제 
> 
> [p5.js 웹에디터](https://editor.p5js.org/){:target="_blank"} 에서 아래 과제를 해결한 여러분만의 프로그램을 클래스룸 댓글에 공유를 해주세요. 
>
> (1) 공룡이 점프했을 때 이미지를 dinoJump로 바꿔보세요. 
>
> (2) 공룡이 장애물과 충돌했을 때 이미지를 dinoDead로 바꿔보고, die.wav파일이 플레이되게 만들어 보세요. 
>
> (3) 장애물을 통과할 때마다 점수를 부여하여 화면에 표시하고, 일정 점수 이상이 되면 point.wav 파일이 플레이되게 만들어 보세요.

