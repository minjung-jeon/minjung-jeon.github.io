---
layout: post
title: "[RxJS] Observables, Observers, Operators"
date: '2019-06-28 15:00:00'
image: '/assets/res/rxjs.png'
description: RxJS - Observables, Observers, Operators
category: 'RxJS'
tags:
- javascript
- ECMAScript
- frontend
- RxJS
twitter_text: RxJS - Observables, Observers, Operators
introduction: RxJS - Observables, Observers, Operators
---

RxJS는 Observables를 사용하여 비동기식 또는 callback 기반의 코드를 보다 쉽게 작성할 수 있도록 도와주는 Reactive Programming 라이브러리입니다.
RxJS를 사용한다면, `Observables, Observsers, Operators` 가 내부적으로 어떻게 작동하는지 이해할 필요가 있습니다.

### Observable 과 Observer

`Observable` 은 시간을 따라 연속적으로 흐르는 데이터이며, RxJS의 가장 기본적인 building block 입니다.
즉, 데이터 스트림을 생성하고 방출하는 객체를 `Observable` 이라고 합니다. 

`Observable` 을 구독하여 `Observable` 이 방출한 `Notification(next, error, complete)` 을 전파받아 사용하는 객체를 `Observer` 라고 합니다.(콜백들의 컬렉션)

```js
const node = document.querySelector('input[type=text]');

const input$ = Rx.Observable.fromEvent(node, 'input');

input$.subscribe({
  next: event => console.log(`You just typed ${event.target.value}!`),
  error: err => console.log(`Oops... ${err}`),
  complete: () => console.log(`Complete!`),
});
```

위의 예제에서 `Observer`는 `.subscibe()` 에 전달한 객체 리터럴 입니다. 
`Observable`에 의해 데이터가 성공적으로 전달이 되면 next가 호출되고, 오류가 발생하면 error함수, 전달이 완료되었을 때는 complete 함수가 호출됩니다. 

따라서, `Observer`은 `Observable`과 `.subscribe()` 메소드를 통해 연결이 됩니다.

### Hot vs Cold Observables

`Cold Observables`는 일반적으로 구독이 시작될때만 값을 생성하거나 방출합니다. 각 구독자는 처음부터 끝까지 동일한 순서의 이벤트를 보게 됩니다.

`Hot Observables`는 Youtube의 실시간 스트림과 같이 새로운 값으로 항상 업데이트되고 있습니다. 구독하면 가장 최근 값으로 시작하여 이후 변경된 사항만 볼 수 있습니다.

#### Cold Observables

```js
const cold = Rx.Observable.create( (observer) => {
    observer.next( Math.random() )
});

cold.subscribe(a => console.log(`Subscriber A: ${a}`))
cold.subscribe(b => console.log(`Subscriber B: ${b}`))


// Subscriber A: 0.2298339030
// Subscriber B: 0.9720023832
```

이 예제에서는 서로 다른 결과를 가진 동일한 Observables를 구독했습니다. 
Cold Observables는 구독이 시작될때 까지 난수를 생성하지 않기 때문입니다.

#### Hot Observables

`Hot Observables`는 외부소스로부터 값을 가져옵니다. 우리는 관찰 가능한 create 함수 밖에서 단순하게 난수를 이동시킴으로써 실시간으로 업데이트 할 수 있습니다.

```js
const x = Math.random()

const hot = Rx.Observable.create( observer => {
  observer.next( x )
});

hot.subscribe(a => console.log(`Subscriber A: ${a}`))
hot.subscribe(b => console.log(`Subscriber B: ${b}`))
// Subscriber A: 0.312580103
// Subscriber B: 0.312580103
```

이미 만든 Cold Observable을 어떻게 hot으로 만들 수 있을까요? 간단하게 `publish()` 함수를 호출하여 Cold Observables를 hot으로 만들 수 있습니다.
이렇게하면 구독자가 실시간으로 동일한 값을 공유 할 수 있습니다. 값의 emitting 을 시작하려면 구독이 시작된 이후 `connect()` 함수를 호출합니다. 

```js
const cold = Rx.Observable.create( (observer) => {
    observer.next( Math.random() )
})

const hot = cold.publish()

hot.subscribe(a => console.log(`Subscriber A: {a}`))
hot.subscribe(b => console.log(`Subscriber B: {b}`))


hot.connect()

/// Subscriber A: 0.7122882102
/// Subscriber B: 0.7122882102
```


### Operator

`Operator`는 Observable의 생성(Creating), 변환(Transforming), 필터링(Filtering), 에러 처리(Error Handling)의 기능을 하는 함수입니다.

Observable 에서 반환된 값으로 구성하고자 할때, `.subscribe()` 블록에 도달하기 전에 Observable 체인을 통하여 값을 전달시킬 수 있습니다. 이것은 일반적으로 `Operator`을 통해 수행되며, 이를 Stream 이라고 합니다.

`Operator`는 현재의 Observable Instance를 기반으로 항상 새로운 `Observable`을 반환합니다.

```js
const input$ = Rx.Observable.fromEvent(node, 'input')
  .map(event => event.target.value)
  .filter(value => value.length >= 2)
  .subscribe(value => {
    // use the `value`
  });
```

위의 예제에서 

   1. 사용자가 "a"를 입력했다고 가정해보면, Observable 은 이벤트에 반응하여 값을 다음 관찰자에게 전달합니다.
   2. "a"가 .map()에 전달되어 event.target.value의 새로운 Observable을 반환하고, 관찰자는 .next()를 호출합니다.
   3. .next() 는 .map()의 결과값을 사용하여 .map()을 구독하는 .filter()을 호출합니다. 
   4. .filter()은 length가 2이상인 필터링된 결과 값과 함께 .next()를 호출합니다.
   5. 최종적으로 .subscibe()블록을 통해 최종 값을 얻습니다.

예제에서 볼 수 있듯, 새로운 Observable이 반환될때 마다 새로운 Observer는 이전 Observable에 연결되어 있기 떄문에, 요청한 작업을 수행하는 관찰자의 `Stream` 에 따라 값을 전달 할 수 있습니다.
요약하면, `Operator` 는 매번 새로운 Observable 을 반환하므로 우리가 `Stream`을 계속 진행할 수 있습니다.


정리해보면, RxJS 를 사용하여 개발을 할때는 다음과 같은 프로세스를 거치게 됩니다.

   1. 데이터를 `Observable` 로 변환
   2. Observable의 `Operator`를 통해 데이터를 변환, 필터링 등을 진행
   3. 원하는 데이터를 받아 처리하는 `Observer`를 생성
   4. Observable 의 `Subscribe`를 통해 `Observer` 를 등록 (subscribe는 Observer를 파라미터로 받음)
   5. Observable.subscribe 의 반환값인 `Subscription` 을 `Unsubscibe` 하여 구독과 자원을 해제

-----
### Reference
- <a href="https://ultimatecourses.com/blog/rxjs-observables-observers-operators">RxJS: Observables, Observers and Operators Introduction</a>
- <a href="https://angularfirebase.com/lessons/rxjs-quickstart-with-20-examples/">RxJS Quick Start With 20 Practical Examples-angularfirebase</a>
