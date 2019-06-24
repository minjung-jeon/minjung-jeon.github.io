---
layout: post
title: "[RxJS] Reactive Programming 이란?"
date: '2019-06-21 15:00:00'
image: '/assets/res/rxjs.png'
description: Reactive Programming 이란?
category: 'RxJS'
tags:
- javascript
- ECMAScript
- frontend
- RxJS
twitter_text: Reactive Programming
introduction: Reactive Programming
---

   - Reactive programming is a declarative programming paradigm concerned with data streams and the propagation of change.
   Reactive programming 은 데이터 스트림 및 변경에 대한 전파와 관련된 선언적인 프로그래밍 패러다임입니다.
   (<a href="https://en.wikipedia.org/wiki/Reactive_programming">wikipedia - Reactive Programming</a>)


### Reactive Programming?

Reactive Programming 은 비동기 데이터 스트림을 이용한 프로그래밍입니다. 

`stream` 은 시간상으로 정렬된 진행중인 이벤트 흐름이며, 사용자의 입력(이벤트) 뿐만 아니라 속성, 데이터 구조 등을 스트림으로 만들 수 있습니다. 

스트림에 `listen`할 수 있고 그에 따라 `react`할 수 있습니다. 
함수를 사용하여 스트림들을 조합하고, 필터링하고 만들어 낼 수 있습니다. 

스트림은 다른 스트림의 input이 될 수 있으며, 두 개의 스트립을 합칠 수 있고, 필터링 시켜 원하는 이벤트들만 있는 스트림으로 만들 수도 있습니다. 또한 스트림에 있는 데이터 값들을 새로운 스트림으로 map 시킬 수도 있습니다.
스트림에 대한 `listening` 을 구독이라고 합니다. 우리가 정의하는 함수는 observer들 입니다. 스트림은 관찰 대상(subject) 입니다.


스트림은 `값, 오류, 완전한 신호` 세 가지 종류의 이벤트를 `emit`할 수 있습니다. 마지막 두 개(오류, 완전한 신호)를 생략할 수 있으며, 값에 대한 함수 정의에만 집중할 수 있습니다.
각 이벤트가 발생할 때 실행되어질 함수들을 각각 정의하여, 이벤트들을 비동기적으로 실행합니다. (비동기 작업 유형 - Dom Events, Animations, Ajax 등등)


정리해 보면, Reactive Programming 은 다양한 데이터를 데이터 스트림이라는 일괄된 형식으로 만들고, 이 스트림을 구독하여 스트림의 상태 변화에 반응하는 방식으로 동작하도록 작성하는 것을 말합니다.

#### 왜 Reactive Programming을 도입해야 할까?

비동기 처리는 콜백함수나 Promise, Generator, async/await 또는 Observable 로 구현할 수 있습니다. 콜백함수를 사용하는 경우에는 에러 처리가 어렵고, Callback Hell 에 빠질 수 있기 때문에 Promise를 사용하는 것이 더 나은 방법이지만 이 또한 단점이 있습니다.

- 한번에 하나의 데이터를 처리하여 연속성을 갖는 데이터를 처리할 수 없다.
- 서버로 보낸 요청은 취소할 수 없다.

또 다른 문제는 처리해야할 데이터의 유형이 다양하나는 것입니다. 

애플리케이션이 처리해야할 데이터는 여러가지 유형을 가지며, 데이터의 유형에 따라 처리하는 방식도 제각각 입니다. 그러나 Reactive Programming 은 동기/비동기 관계없이 데이터를 생산하는 것이라면 무엇이든 옵저버블로 만들 수 있습니다. 이처럼 다양한 형태의 데이터를 처리하기 위해 일관된 방식을 제공하기 때문에 `안전하고 통일된 데이터 처리`가 가능하다는 장점이 있습니다.

또한 Reactive Programming은 코드의 `추상화` 레벨을 끌어올려줌으로써, 비즈니스 로직을 규정하는 이벤트들 간의 상호관계에만 집중할 수 있게 해줍니다. 세부 구현을 어떻게 해야하는지 계속 만지작거릴 필요가 없게 됩니다. 그리하여 Reactive Programming으로 짠 코드는 매우 간결하게 보입니다.

지금의 앱들은 높은 수준으로 사용자에게 상호작용 경험을 제공하는 거의 모든 종류의 실시간 이벤트들이 넘쳐나고 있습니다. 이러한 것들을 적절하게 다루기 위해 Reactive Programming 이 필요합니다.

-----
### Reference
- <a href="http://reactivex.io/intro.html">ReactiveX</a>
- <a href="https://dev.to/sagar/reactive-programming-in-javascript-with-rxjs-4jom">Reactive Programming in JavaScript with RxJS.</a>
- <a href="https://gist.github.com/staltz/868e7e9bc2a7b8c1f754">The introduction to Reactive Programming you've been missing</a>

