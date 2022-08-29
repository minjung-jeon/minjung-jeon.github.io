---
layout: post
title: "[Web] script 속성 async/defer"
date: '2022-07-27 15:00:00'
image: '/assets/res/web.png'
category: 'Web'
tags:
- javascript
- frontend
- web
- async
- defer
paginate: false
author: minjnug
---

일반적으로 웹 브라우저에서 돌아가는 Script 들은 대부분 HTML 보다 무겁기 때문에, 다운로드, 스크립트 실행 처리 시에 오랜 시간이 걸린다.

브라우저 동작 과정 중 HTML을 파싱하다가 `<script></script>` 태그를 만나면 script 를 먼저 실행해야 하므로 DOM 생성을 멈추게 된다.

![placeholder](../assets/res/web/script.png "Medium example image")

그러므로 웹 브라우저의 렌더링 성능을 최적화 하면서 가장 중요하게 확인해봐야할 것은 랜더링을 막는 스크립트 실행이 존재하는지에 대한 여부이다.

이때, script 속성의 defer, async 를 적절하게 활용하여 블로킹 script 를 해결할 수 있다.

async 와 defer 는 HTML 파서를 차단하지 않고 병렬로 스크립트를 로드할 수 있는 속성이라는 점에서 유사하다.

그럼 각각의 특징과 차이점에 대해 알아보자.

### defer

`defer` 은 HTML 문서가 파싱되기 전까지 실행되지 않는 속성이다. 즉, 모든 DOM이 로드된 후에야 실행된다.

또한 스크립트는 선언한대로 실행 순서가 보장된다.

스크립트를 백그라운드에서 다운로드 하고, 실행 시점을 지연시키는 것이나 `DOMContentLoaded` 이벤트가 발생되기 전에 실행된다.

그러므로 DOM의 모든 Element에 접근할 수 있고, 실행 순서도 보장되기 때문에 가장 범용적으로 사용할 수 있는 속성이다.

![placeholder](../assets/res/web/defer.png "Medium example image")

- DOMContentLoaded 이벤트 발생 전에 실행
- 실행 순서 보장
- DOM 전체가 필요한 스크립트나 실행 순서가 중요한 경우에 사용

### async

`async` 속성이 붙으면 페이지와 완전히 독립적으로 동작하게 된다.

defer 와 마찬가지로 백그라운드에서 다운로드 되지만 `DOMContentLoaded` 이벤트와 async 는 서로를 기다리지 않는다.
(`DOMContentLoaded`는 async 실행 전에도 발생할 수 있고, 실행 후에도 발생할 수 있다.)

다른 스크립트들과도 독립적이기 때문에 async 스크립트가 여러개 있는 경우 그 실행 순서가 제각각이 된다.
그러므로 async 스크립트는 DOM에 직접 접근하지 않으며, 다른 스크립트에 의존적이지 않은 파일들을 독립적으로 실행해야 할 때 효과적이다.

`async`로 로드된 스크립트는 다운로드가 완료되면 즉시 구문을 분석하고 실행한다.

- DOMContentLoaded 이벤트와 서로 영향을 미치지 않음(순서가 없음)
- 실행 순서 보장되지 않음
- 광고 스크립트나 방문자수 카운터 등 독립적인 스크립트의 경우에 사용

![placeholder](../assets/res/web/async.png "Medium example image")


-----
### Reference
- <a href="https://javascript.info/script-async-defer">Scripts: async, defer</a>
- <a href="https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html#script">async vs defer attributes</a>
