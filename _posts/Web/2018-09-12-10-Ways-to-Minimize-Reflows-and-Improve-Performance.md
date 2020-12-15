---
layout: post
title: "[Web] [번역] 10 Ways to Minimize Reflows and Improve Performance"
date: '2018-09-12 17:00:00'
image: '/assets/res/web.png'
description: Reflow 최소화와 성능 향상의 10가지 방법
category: 'Web'
tags:
- javascript
- frontend
- web
- performance
- reflow
twitter_text: Reflow 최소화와 성능 향상의 10가지 방법
introduction: Reflow 최소화와 성능 향상의 10가지 방법
---

2MB 성능에 도달하는 웹 페이지에도 불구하고 hot topic 이 남아 있습니다. 어플리케이션이 더 매끄러울수록 사용자 환경이 개선되고 전환율이 높아집니다.

즉, 결과를 고려하지 않고 피상적 CSS3 애니메이션을 추가하거나 여러 DOM 요소를 조작하는 것은 잘못입니다. 시각적인 영향이 적용될 때 브라우저 세계에서 사용되는 두가지 용어는 다음과 같습니다.
 
## Repaints
`repaint`는 가시성에는 영향을 주지만 레이아웃에는 영향을 주지 않는 요소를 변경할 때 발생합니다. 예를들어 opacity, background-color, visibility, outline 이 있습니다.
브라우저가 DOM에 있는 다른 모든 노드의 사시성을 확인해야하기 때문에 `repaint`의 비용은 많이 듭니다. 하나 이상의 노드가 변경된 요소 아래에 표시 될 수 있습니다.


## Reflows
`reflow`는 더 큰 영향을 미칩니다. 이는 모든 요소의 위치 및 치수를 재 계산하여 문서의 전부 또는 일부를 다시 렌더링 하는 것을 의미합니다. 단일 요소를 변경하는 것은 모든 부모요소, 형제요소, 자식요소에 영향을 줄 수 있습니다.

둘 다 브라우저를 차단합니다. 사용자나 어플리케이션은 repaint 되거나 reflow 되는 동안 다른 작업을 수행할 수 없습니다. 극단적인 경우 CSS 효과로 인해 JavaScript 실행 속도가 느려질 수 있습니다.
이는 갑작스러운 스크롤링과 응답이 없는 인터페이스와 같은 문제가 발생하는 이유 중 하나입니다.

reflow 가 발생되는 시점을 이해하는 것이 유용합니다.

**DOM 요소 추가, 제거 또는 변경**
첫번째는 명백합니다. JavaScript 5   를 사용하여 DOM을 변경하면 reflow가 발생합니다.

**CSS 스타일 추가, 제거 또는 변경**
마찬가지로, CSS 스타일을 직접 적용하거나 클래스를 변경하면 레이아웃이 변경될 수 있습니다. 요소의 너비를 변경하면 동일한 DOM 브랜치의 모든 요소와 그 주변의 요소에 영향을 줄 수 있습니다.

**CSS3 애니메이션과 트랜지션**
애니메이션의 모든 프레임은 reflow를 유발합니다.

**offsetWidth 와 offsetHeight 의 사용**
이상하게도, 요소의 offsetWidth와 offsetHeight 속성을 읽으면 초기 reflow가 트리거되어 수치를 계산할 수 있습니다.

**사용자 액션**
마지막으로 사용자는 a태그의 호버효과, 필드에 텍스트 입력, 창 크기 조절, 글꼴 크기 변경, 스타일시트 또는 글꼴 전환 등을 활성화하여 reflow를 트리거 할 수 있습니다.

reflow의 처리 흐름은 달라질 수 있습니다. 일부 브라우저는 특정 작업시 다른 브라우저보다 우수합니다. 어떤 요소는 다른 요소에 비해 렌더링 비용이 더 많이 듭니다. 다행히도 성능을 향상시키기 위해 사용할 수 있는 몇 가지 일반적인 팁이 있습니다.

<br/>

### 1. Use Best-Practice Layout Techniques
2015년에 이런 말을 해야 하다니 믿을 수 없지만 레이아웃을 위해 인라인 스타일이나 테이블을 사용하지 않아야합니다.


인라인 스타일은 HTML이 다운로드되고 추가 reflow를 트리거할 때 레이아웃에 영향을 미칩니다. 테이블은 셀 치수를 계산하기 위해 파서가 둘 이상의 패스를 필요로 하기때문에 비용이 많이 듭니다.
테이블 레이아웃 사용: fixed 는 열 너비는 헤더 행 내용을 기반으로 하므로 표 형식의 데이트를 표시할때 도움이 됩니다.

flexbox 의 위치와 크기가 HTML이 다운로드 될 때 변경될 수 있기 때문에 메인 페이지 레이아웃에 flex 아이템을 사용하면 성능이 저하 될 수 있습니다.

<br/>

### 2. CSS 규칙의 수를 최소화합니다 (Minimize the Number of CSS Rules)

사용하는 규칙이 적을수록 reflow가 빨라집니다. 가능한 경우 복잡한 CSS Selector를 피해야 합니다.

이 문제는 부트스트랩과 같은 프레임워크를 사용하는 경우 특히 문제가 될 수 있습니다. 제공된 스타일중 일부를 사용하는 사이트는 거의 없습니다.
사용되지 않는 CSS, uCSS, grunt-uncss, gulp-uncss와 같은 도구는 스타일의 도구와 파일의 크기를 상당히 줄일 수 있습니다.

<br/>

### 3. DOM의 깊이를 최소화합니다 (Minimize DOM depths)

DOM 트리의 크기와 각 branch의 요소 수를 줄여야합니다. 문서가 작고 얕을수록 reflow 될 수 있습니다. 이전 브라우저를 지원하지 않는 경우 불필요한 wrapper 요소를 제거할 수 있습니다.

<br/>

### 4. 말단의 DOM 트리에서 클래스를 변경합니다 (Update Classes Low in the DOM Tree)

가능한 한 최대한 말단의 DOM 트리의 요소(즉, 중첩된 하위 항목이 여러 개 없는 요소)에서 클래스를 변경합니다.
이렇게 하면 reflow 범위가 필요한 만큼의 노드로 제한 될 수 있습니다. 본질적으로 중첩된 child 노드에 대한 영향이 최소인 경우에만 wrapper와 같은 부모 노드에 클래스 변경 사항을 적용합니다.

<br/>

### 5. 복잡한 애니메이션 flow에서 제거합니다 (Remove Complex Animations From the Flow)

애니메이션이 `position: absolute;` 나 `position: fixed;` 로 문서의 flow 로 부터 제거되어 단일 요소로 적용되어 있는지 확인합니다.
이렇게 하면 문서의 다른 요소에 영향을 주지 않고 치수 및 위치를 수정할 수 있습니다.
 
### 6. 숨겨진 요소를 변경합니다 (Modify Hidden Elements)

`display: none;` 로 숨겨진 요소는 변경될 때 repaint 나 reflow 를 유발하지 않습니다. 가능한 경우 요소를 표시하기 하기전에 변경합니다.


### 7. Batch 로 요소 업데이트 (Update Elements in Batch)

한 번의 작업으로 모든 DOM 요소를 업데이트하여 성능을 향상시킬 수 있습니다. 이 간단한 예는 세가지 reflow를 발생시킵니다.

```js
var myelement = document.getElementById('myelement');
myelement.width = '100px';
myelement.height = '200px';
myelement.style.margin = '10px';
```

이를 단일 reflow 로 줄일 수 있으며, 유지보수가 더 쉽습니다. 예를 들어,

```js
var myelement = document.getElementById('myelement');
myelement.classList.add('newstyles');
```

```css
.newstyles {
	width: 100px;
	height: 200px;
	margin: 10px;
}
```

또한 DOM을 건드리는 시간을 최소화할 수 있습니다. bullet 목록을 만들겠다고 가정해 보겠습니다.

각 요소를 하나씩 추가하면 한 번에 최대 7개의 reflow 가 발생합니다.(하나는 <ul>이 추가 될 때, 다른 하나는 <li>에 대해 3개, 텍스트에 대해 3개입니다.)
그러나, DOM fragment 을 사용하여 구현하고 메모리에 노드를 먼저 빌드하면 단일 reflow 가 구현 될 수 있습니다. 

```js
var
	i, li,
	frag = document.createDocumentFragment(),
	ul = frag.appendChild(document.createElement('ul'));

for (i = 1; i <= 3; i++) {
	li = ul.appendChild(document.createElement('li'));
	li.textContent = 'item ' + i;
}

document.body.appendChild(frag);
```


### 8. 영향을 받는 요소를 제한합니다. (Limit the Affected Elements)

많은 수의 요소가 영향을 받을 수 있는 상황을 피하십시오. 탭을 클릭하면 다른 콘텐츠 블록이 활성화되는 캡 콘텐츠 컨트롤을 고려하세요.
각 컨텐츠 블록의 높이가 다른 경우 주변 요소에 영향을 미칩니다. container 에 대한 고정 높이를 설정하거나 document 의 flow 에서 컨트로를 제거하여 성능을 향상 시킬 수 있습니다.


### 9. 부드러운 애니메이션은 성능을 떨어뜨린다는 것을 알아야합니다. (Recognize that Smoothness Compromises Performance)

요소를 한번에 한 픽셀 씩 이동한다면 부드러워 보일 수 있지만 속도가 느린 디바이스에서는 어려움을 겪을 수 있습니다. 요소를 프레임 당 4 픽셀씩 이동시키려면 reflow 처리의 1/4이 필요하며 부드럽지 않을 수 있습니다.


### 10. 브라우저 툴로 repaint 이슈 분석 (Analyze Repaint Issues with Browser Tools)

모든 mainstream 브라우저는 reflow 가 성능에 미치는 영향을 강조하는 개발자 도구를 제공합니다. Chrome, Safari 및 Opera와 같은 Blink/Webkit 브라우저에서 `TimeLine` 패널을 열고 작업을 기록하세요.

![placeholder](../assets/res/web/reflow_timeline.png "Medium example image")

Firefox 개발자 도구에서도 유사한 Timeline 패널을 사용할 수 있습니다.

모든 브라우저는 reflow 및 repainting 시간을 녹색으로 표시합니다. 위의 테스트는 유의미한 애니메이션이 포함되지 않은 간단한 예였지만 레이아웃 렌더링에는 스크립팅과 같은 다른 요소보다 더 많은 시간이 필요합니다.
reflow 횟수를 줄이면 성능이 향상됩니다.


-----
### Reference
- <a href="https://www.sitepoint.com/10-ways-minimize-reflows-improve-performance/?utm_source=webopsweekly&utm_medium=email">10 Ways to Minimize Reflows and Improve Performance</a>