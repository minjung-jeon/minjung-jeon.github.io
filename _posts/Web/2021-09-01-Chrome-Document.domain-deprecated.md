---
layout: post
title: "[Web] Chrome Document.domain Deprecated"
date: '2021-09-01 15:00:00'
image: '/assets/res/web.png'
category: 'Web'
tags:
- javascript
- frontend
- web
- SOP
- Document.domain
- window.postMessage
paginate: false
author: minjnug
---

## 동일 출처 정책(SOP)

>동일 출처 정책(same-origin policy)는 어떤 출처에서 불러온 문서나 스크립트가 다른 출처에서 가져온 리소스와 상호작용하는 것을 제한하는 중요한 보안 메커니즘입니다. 동일 출처 정책은 잠재적으로 해로울 수 있는 문서를 분리함으로써 공격받을 수 있는 경로를 줄여줍니다.
> ([Same Origin Policy MDN](https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy))


[Same-Origin, Same-Stie 관련 이전 작성 글](https://minjung-jeon.github.io/same-site-same-origin)


## Document.domain

> Document 인터페이스의 domain 속성은 동일 출처 정책에서 사용하는 현재 문서의 출처에서 도메인 부분을 설정하거나 가져옵니다.
> ([Document.domain MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/domain))

서브 도메인간의 iframe, window.open 등의 형태로 페이지를 구성할 때, 동일 출처 정책에 따라 cross domain 이슈가 발생한다. 이때, 서브 도메인간의 통신을 위하여 주로 `Document.domain` 의 속성을 사용해 왔지만 이 속성은 더 이상 권장되지 않으며, 제거되는 중이라고 한다.(MDN 문서 참고)


### Deprecated

Chrome 에서 document.domain은 이제 Setter 가 되지 않는다. 이는 동일 출처 정책이 제공하는 보안 보호를 악화시키고, 브라우저의 출처 모델을 복잡하게 만들어 상호 운용성 문제와 보안 버그를 일으킨다.

document.domain 설정으로 모든 하위 도메인에서 페이지의 DOM에 대한 전체 액세스를 허용할 수 있으며, 이는 위험할 수 있다. 또한 원본에서 포트 구성 요소를 제거하므로, 이제 포트가 다른 동일한 IP 주소 또는 동일한 호스트 구성 요소를 가진 다른 페이지에서 액세스할 수 있게된다.

그리므로 앞으로는 document.domain 대신 더 안전한 Window.postMessage 를 사용하여 다른 원본에 비동기 메시지를 보내는 방식으로 개발이 필요하다.


## Window.postMessage()

> window.postMessage() 메소드는 Window 오브젝트 사이에서 안전하게 cross-origin 통신을 할 수 있게 합니다.
> ([Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage))

한 window는 다른 window를 참조할 수 있고 (ex. targetWindow = window.opener), `targetWindow.postMessage()` 를 통해 다른 window에 MessageEvent를 전송할 수 있다.

### Syntax

> targetWindow.postMessage(message, targetOrigin, [transfer]);

##### targetWindow

메세지를 전달 받을 window의 참조
예시는 다음과 같다.

- Window.open (새 창을 만들고 새 창을 참조할 때),
- Window.opener (새 창을 만든 window를 참조할 때),
- HTMLIFrameElement.contentWindow (부모 window에서 <iframe>을 참조할 때),
- Window.parent (<iframe> 에서 부모 window를 참조할 때),
- Window.frames[index]

##### message

다른 window에 보내질 데이터


##### targetOrigin

targetWindow의 origin을 지정

이는 전송되는 이벤트에서 사용되며, 문자열 `* 혹은 URI` 값이 들어간다. (targetWindow의 스키마, 호스트 이름, 포트가 targetOrigin의 정보와 일치해야 이벤트 전송이 된다.)


### Example

```javascript
/**
 * http://example.com:8080 페이지의 스크립트(발신)
 */
var popup = window.open(...popup details...);

// 팝업이 완전히 로드되었을 때:
popup.postMessage("post message", "http://example.com");
```

```javascript
/**
 * http://example.com 팝업 페이지의 스크립트(수신)
 */

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  // message 의 발신자를 신뢰하는지 체크
  if (event.origin !== "http://example.com:8080"){
    return;
  }

  // event.source 는 window.opener
  // event.data 는 message
}
```



-----
### Reference
- <a href="https://developer.mozilla.org/en-US/docs/Web/Security/Same-origin_policy">Same Origin Policy MDN</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/API/Document/domain">Document.domain</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage">Window.postMessage</a>