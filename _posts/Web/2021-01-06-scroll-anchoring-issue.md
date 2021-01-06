---
layout: post
title: "[Web] '더보기(More)' 버튼 관련 scroll 이슈 (overflow-anchor)"
date: '2021-01-06 15:00:00'
image: '/assets/res/web.png'
category: 'Web'
tags:
- javascript
- frontend
- web
- overflow-anchor
paginate: false
author: minjnug
---

얼마전 '더보기' 버튼을 클릭하여 더 많은 콘텐츠를 로드하는 기능을 구현했을 때, chrome 환경에서 '더보기' 버튼에 스크롤이 고정 된 채로 그 위로 콘텐츠가 추가되는 이슈가 발생했었다.

이때 이슈 해결을 위하여, `scroll anchoring` 이라는 브라우저 기능에 대하여 찾아보게 되었다.

<br />

### Scroll Anchoring 이란?

lazy loading, progressive loading 등 동적으로 node가 추가 될 경우에 나중에 로드된 콘텐츠로 레이아웃이 변경되며, 이때 전체적인 스크롤 위치가 바뀌어 사용자에게 불편함을 주는 사례가 발생한다. 

Chrome 56 부터 이러한 스크롤 위치가 바뀌는 이슈를 해결하기 위하여 `scroll anchoring` 이라고 불리는 기능을 추가했으며, 이는 뷰포트에서 스크롤 위치를 고정시키고 뷰포트 외부의 콘텐츠가 계속 로드 되더라도 사용자가 동일한 위치를 볼 수 있도록 도와준다. 

![placeholder](../assets/res/web/scroll-anchoring.gif "scroll anchoring example")

위 영상에서와 같이 좌측은 추가된 콘텐츠로 인하여 스크롤의 위치가 바뀐 상황이고, 우측은 scroll anchoring 이 적용되어 스크롤이 고정된 상황이다.

그러나 웹의 다양한 상황으로 인하여 scroll anchoring이 오작동 하는 경우가 발생할 수 있으며, 이를 위해 `overflow-anchor` css 속성을 통하여 선택적으로 scroll anchoring 을 핸들링 할 수 있다.

<br />

### Syntax & Values

```css
overflow-anchor: auto;
overflow-anchor: none;
```

- `auto(default)` : 적용되는 요소 부분에 scroll anchoring을 활성화 합니다.
- `none` : 적용되는 요소에 scroll anchoring을 비활성화 합니다.

참고 : overflow-anchor는 상속되지 않는다.(overflow-anchor:none 요소의 하위 항목에 대하여 명시적으로 다시 설정해야 한다.)

<br />

### Anchoring Node 선택 조건

[CSS W3C](https://drafts.csswg.org/css-scroll-anchoring/#anchor-node-selection) 에서 설명한 Anchoring 선택 조건

아래의 조건을 만족하는 경우, 요소 C는 scrolling box S를 위한 고려할만한 후보가 될 수 있다.
- C가 non-atomic inline 이 아닐 경우
- C가 S 내에서 부분적 또는 완전히 보여질 경우
- C가 S의 하위요소일 경우
- S내에서 C의 조상요소가 서브트리에서 제외되지 않을 경우

일부의 요소는 **anchor 선택을 위한 우선 후보**로 고려된다.
- 문서의 포커스된 영역에 대한 DOM anchor(editable, editing host, mutable textarea, or mutable input with a type that allows text entry).
- 페이지 내 찾기(user-agent 알고리즘)의 현재 활성화된 검색 결과를 포함 하는 요소. (일치 항목이 여러 요소에 있을 경우 첫 번째 요소만 고려함)


**scroll anchoring 대상 Node에서 제외되는 조건**
1. display: none 속성을 포함한 경우
2. position: fixed 속성을 포함한 경우
3. position: absolute 이고 해당 노드에 scrolling box의 조상 요소(부모 요소를 포함해 계층적으로 현재 요소보다 상위에 존재하는 모든 요소)가 컨테이닝 블록([MDN 컨테이닝 블록](https://developer.mozilla.org/ko/docs/Web/CSS/All_About_The_Containing_Block))인 경우
4. overflow-anchor: none 속성을 포함한 경우

<br />

### overflow-anchor 예제

아래의 예제에서는 각 영역을 스크롤 할 때, 1 초 후 상단에 검은색 영역이 추가된다. 이때 `overflow-anchor`의 각 값에 따라 어떤 현상이 발생하는지 확인해볼 수 있다.

<iframe height="405" style="width: 100%;" scrolling="no" title="VwKXRZE" src="https://codepen.io/minjung-jeon/embed/VwKXRZE?height=405&theme-id=light&default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/minjung-jeon/pen/VwKXRZE'>VwKXRZE</a> by minjung
  (<a href='https://codepen.io/minjung-jeon'>@minjung-jeon</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

왼쪽 영역은 스크롤 위치가 고정된 상태에서 뷰포트 외부의 검은색 영역이 추가되었고, 오른쪽 영역에서는 검은색 영역이 추가될때 스크롤 위치가 바뀌는 것을 확인 할 수 있다.

<br />

### Browser Support

![placeholder](../assets/res/web/scroll-anchoring-support.png "scroll anchoring support")

IE, safari 는 아직 지원되지 않으며, Firefox는 66, Opera는 43, Edge는 79부터 지원 한다.
더 자세한 브라우저 지원 범위는 [Can I Use](https://caniuse.com/css-overflow-anchor) 에서 확인할 수 있다.

<br />

### `overflow-anchor:none` 을 사용한 '더보기' Scroll 이슈 해결

'더보기' 버튼에 스크롤이 고정 된 채로 그 위로 콘텐츠가 추가되는 이슈도 scroll anchoring이 동작해서 발생했던 이슈이다.

'더보기' 버튼을 button 이나 a 태그로 구현할 경우, anchor 선택을 위한 우선 후보 조건인 **문서의 포커스된 영역** 으로 인식하여 scroll anchoring 이 동작하여 뷰포트에 고정되었다.
(button 이나 a 태그 대신 div로 바꾼다면, scroll anchoring이 동작하지 않음)

이는 Chrome 84 이후에 발생했던 이슈로, 문서의 포커스된 영역에 대한 조건이 추가되었던 히스토리가 있다.
- [히스토리](https://github.com/w3c/csswg-drafts/issues/5018)
- [구글 git](https://chromium-review.googlesource.com/c/chromium/src/+/2199603)


해당 이슈는 '더보기' 버튼에 `overflow-anchor: none` 속성을 추가하여 해결 할 수 있었다.

그 이후 '더보기' 관련 같은 이슈를 겪은 다른 사람들의 버그 제보가 있었고, 초점 우선 순위를 편집 가능한 요소로 제한하도록 수정되었다. (이는 바로 다음 버전인 85 에서 수정된 것으로 보인다.)
- [버그 관련 글](https://bugs.chromium.org/p/chromium/issues/detail?id=1102229)
- [구글 git](https://chromium-review.googlesource.com/c/chromium/src/+/2363079)

현재 Chrome 최신 버전인 87 에서는 '더보기' 관련 이슈가 발생 안하는 것으로 확인 되었다.


-----
### Reference
- <a href="https://blog.chromium.org/2017/04/scroll-anchoring-for-web-developers.html">Chromium Blog - Scroll anchoring for web developers</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor/Guide_to_scroll_anchoring">MDN Web Docs - Guide to scroll anchoring</a>