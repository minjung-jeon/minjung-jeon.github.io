---
layout: post
title: "[Web] 이벤트루프(Event Loop)"
date: '2018-08-22 15:37:00'
image: '/assets/res/web.png'
description: 이벤트루프(Event Loop)
category: 'Web'
tags:
- javascript
- frontend
- web
- event loop
twitter_text: Event Loop
introduction: Event Loop
---


## 자바스크립트 런타임(Runtime)

![placeholder](../assets/res/web/eventloop_engine.png "Medium example image")

엔진은 Memory Heap 과 Call Stack, 두 주요한 요소로 구성되어 있다.
- Memory Heap: 메모리할당이 일어난다.
- Call Stack: 코드 실행에 따라 스택 프레임들이 쌓인다.

자바스크립트 Runtime 구조에는 heap과 stack이 존재하지만
자주 사용하는 setTimeout 이나 Http Request 등은 엔진에서 찾아볼 수 없다.
이러한 API들은 브라우저 에서 제공하고 있다.

![placeholder](../assets/res/web/eventloop_engine2.png "Medium example image")

자바스크립트 Runtime을 포함한 더 큰 구조로 브라우저가 제공하는 Web APIs, Callback Queue, Event Loop가 존재한다.

자바스크립트는 싱글스레드(Single Thread) 프로그래밍 언어로 한번에 하나의 작업을 처리한다.
즉, 하나의 Call Stack 을 가지고 있다.(콜스택은 데이터 스트럭처로 실행되는 순서를 기억하고 있다.)
요청이 들어올때마다 해당 요청을 순차적으로 호출 스택에 담아 처리한다.

만약 느리게 동작하는 코드가 스택에 쌓인다면 싱글스레드 기반의 자바스크립트는 
그 코드가 끝날때 까지 다른 작업을 하지 못하게 되고 브라우저의 동작이 멈추게 되는데 이를 블로킹이라고 한다.

이와 같은 문제를 해결하기 위해 비동기 콜백을 사용한다.
비동기 콜백은 어떤 코드를 실행하면 콜백을 받아 나중에 실행할 수 있다.

이 과정에서 이벤트루프와 동시성이 등장하게 된다.

## 이벤트루프(Event Loop)와 동시성(Concurrency)

```js
console.log('Hi');

setTimeout(function cb() {
    console.log('there');
}, 5000);

console.log('JS');
```

위 코드를 실행하면 'Hi', 'JS' 가 출련된 후 약 5초 후 'there'이 출력되는 것을 확인할 수 있다.
(<a href="http://latentflip.com/loupe">자바스크립트 런타임을 시각화 해주는 사이트</a>)

먼저 첫번째 console.log('Hi') 가 스택에 쌓이고 로깅한뒤 스택에서 사라지게 된다.
두번째로 setTimeout는 WebAPI이기 때문에 브라우저가 타이머를 실행시키고 카운트 다운을 시작한다.

![placeholder](../assets/res/web/eventloop_setTimeout.png)

setTimeout의 호출은 완료가 되었으므로 스택에서 함수가 사라지고 세번째 console.log('JS')가 스택에 쌓이고 로깅한 뒤 지워진다.
이제 WebAPI 에서 실행하고 있는 타이머는 5초를 모두 카운트하더라도 스택에 끼어들어 작업을 처리할 수는 없게된다.

이 처리를 위해 테스크큐와 콜백큐가 등장한다.

![placeholder](../assets/res/web/eventloop_queue.png)

모든 WebAPI는 작동이 완료되면 콜백을 테스크 큐에 밀어 넣고, **이벤트 루프(event loop)** 는 스택이 비어있다면 테스크 큐에 있던 콜백을 스택에 넘겨준게 된다.

![placeholder](../assets/res/web/eventloop_callback.png)

이제 자바스크립트 엔진으로 돌아가서 스택의 마지막 console.log('there')을 로깅한다.

비동기함수의 동작을 정리해보면,
- 모든 Web API 작동이 완료되면 콜백을 테스크 큐에 밀어넣고, 이벤트 루프는 테스크 큐에 있는 콜백을 스택에 넘겨준다.
- 이벤트 루프의 역할은 콜 스택과 테스크 큐를 주시하여 스택이 비어질때 까지 기다린 후 테스크 큐에 있는 콜백을 스택에 쌓는 것이다.

### Zero Delay

```js
console.log('Hi');

setTimeout(function cb() {
    console.log('there');
}, 0);

console.log('JS');

```

setTimeout 0 을 한다면 0ms 후에 즉시 실행되는 콜백을 의미하지 않는다. 
다음 코드에서도 'Hi', 'there', 'JS' 순서로 출력될 것이다. 이벤트 루프가 스택이 비워져 있는지 확인을 하여 테크스 큐에서 스택으로 넘겨주기 때문에 순서에는 변함이 없다.

마찬가지로 만약 setTimeout 1초씩 4번 호출을 한다면,
콜백 큐에 쌓인 후 네번째 콜백이 1초후에 실행되어야 함에도 불구하고, 늦게 실행된다. (실제로 정해진 시간과는 달리 동작한다.)

즉, setTimeout 의 delay는 보장된 시간이 아닌 요청을 처리하기 위한 최소의 시간인 것이다.
(zero delay는 콜백을 스택의 마지막까지 지연시키는 것)

### 랜더링과의 관계

스택에 코드가 있다면 랜더링을 하지 못한다. 랜더도 또 하나의 콜백과 같이 여겨지기 때문이다.
랜더가 지연되면 화면의 동작을 실행할수 없다. 또한 브라우저는 호출 스택이 정말 많은 작업들을 처리하다가 화면이 오랫동안 응답을 하지않는다면,
브라우저는 에러를 띄우면서 페이지를 종료할 건지 물어보게된다.

매 16ms 마다 큐에 렌더가 들어가고, 스택이 비어진 후에야 랜더링을 한다.(랜더는 코드의 콜백에 비해 더 높은 우선순위를 갖는다.)

동기버전은 스택을 차지하므로, 느린 코드가 있다면 화면의 동작이 멈추고 브라우저가 에러를 띄우는 현상이 발생할 수 있다.
그렇기 때문에 여러개의 콜백을 큐에 쌓고 스택이 비워지면 쌓인 콜백들을 실행하는 비동기 버전을 사용하여 스택의 사이에 랜더가 끼어들 수 있는 자리를 준다.
스택에 불필요한 느린 코드를 쌓아서 브라우저가 할일을 못하게 만들지 말고 유동적인 UI를 만들어야한다.


-----
### Reference
- <a href="https://blog.sessionstack.com/how-does-javascript-actually-work-part-1-b0bacc073cf">How JavaScript works: an overview of the engine, the runtime, and the call stack</a>
- <a href="https://www.youtube.com/watch?v=8aGhZQkoFbQ">Philip Roberts: What the heck is the event loop anyway? | JSConf EU</a>