---
layout: post
title: "[RxJS] Operators 2 - Join Operators"
date: '2019-07-19 15:00:00'
image: '/assets/res/rxjs.png'
subtitle: combineAll, concatAll, exhaust, mergeAll, startWith, withLatestFrom
description: RxJS Operators - Join Operators
category: 'RxJS'
tags:
- javascript
- ECMAScript
- frontend
- RxJS
- Operators
author: minjnug
---

## combineAll

> combineAll(project: function): Observable

- project (optional) : 각 내부 Observable의 최신 값을 새로운 결과로 매핑하는 선택적 함수
<br/>(수집된 각 Observable의 최신 값을 인수의 순서대로 가져옵니다.)


`combineAll` 은 외부 Observable이 완료되면, 내부의 Observable의 최신 값들을 결합하여 출력합니다.

`combineAll`의 `project` 함수가 제공된다면, 각각의 내부 observable 로부터 최근 값이 도착한 순서대로 호출되며, `project` 함수의 결과는 observable에 의해 emit 됩니다.
만약 `project` 함수가 없다면, 가장 최근의 모든값의 배열이 observable 출력에 의해 emit 됩니다.

##### Examples

```js
// 5초 후에 emit 한 후 complete
const fiveSecondTimer = timer(5000).pipe(
    // 타이머가 발생하고 완료되면, 내부의 관찰 가능 항목에서 최근에 방출된 값이 출력 됩니다.
    mapTo(of('Hello', 'World'))
);
const combined = fiveSecondTimer.pipe(combineAll());
const subscribe = combined.subscribe(val => console.log('Values from inner observable:', val));
// 5초 후에 output 출력
// Values from inner observable: ["Hello"]
// Values from inner observable: ["World"]


//project 함수가 있는 경우
const fiveSecondTimer = timer(5000).pipe(
    mapTo(of('Hello', 'World'))
);
const combined = example.combineAll(val => `${val} Friend!`);
const subscribeProjected = combined.subscribe(val => console.log('Values Using Projection:', val));
// 5초 후에 output 출력
// Values from inner observable: Hello Friend!
// Values from inner observable: World Friend!
```

```js
// 1초마다 2번 emit
const source = interval(1000).pipe(take(2));
// source에서 emit 된 값에서 각 5개의 값을 가져오는 interval observable
const example = source.pipe(
  map(val =>
    interval(1000).pipe(
      map(i => `Result (${val}): ${i}`),
      take(5)
    )
  )
);

// 내부의 observable의 값을 포함한 combineAll 관측값의 첫번째 emission은
// 외부의 관측값의 첫번째 값을 내야만 나타나기 때문에 10가지가 아닌 9가지
const combined = example.pipe(combineAll());
 /*
  output:
  ["Result (0): 0", "Result (1): 0"] 
  ["Result (0): 1", "Result (1): 0"]
  ["Result (0): 1", "Result (1): 1"]
  ["Result (0): 2", "Result (1): 1"]
  ["Result (0): 2", "Result (1): 2"]
  ["Result (0): 3", "Result (1): 2"]
  ["Result (0): 3", "Result (1): 3"]
  ["Result (0): 4", "Result (1): 3"]
  ["Result (0): 4", "Result (1): 4"]
*/
const subscribe = combined.subscribe(val => console.log(val));
```


<br/>
<br/>

## mergeAll

> mergeAll(concurrent: number): Observable

- concurrent (optional) : Number.POSITIVE_INFINITY
<br/>(동시에 구독할 수 있는 내부 Observable의 최대 수)

중첩된 모든 Observables(Observable-of-Observables)을 수집하고 구독하여 평평하게 합니다.

`mergeAll`은 Observables을 emit하는 Observable을 구독합니다. emit된 내부 Observable 중 하나를 관찰할 때 마다, 내부 Observable을 구독하고, Observable 내부의 모든 값을 출력에 전달합니다. Observable 출력은 모든 내부의 Observable이 완료되면 실행됩니다. 내부 Observable에 의해 전달된 모든 오류는 Observable 출력에서 즉시 emit 됩니다.


##### Example

- 각 클릭 이벤트에 대하여 새로운 interval Observable을 생성하고, 하나의 Observable로 혼합합니다.
(여러번 클릭할 경우 클릭한 횟수대로 새로운 interval이 생성되고 실행)

```js
const clicks = fromEvent(document, 'click');
const higherOrder = clicks.pipe(
    map((ev) => interval(1000))
);
const firstOrder = higherOrder.pipe(mergeAll());
firstOrder.subscribe(x => console.log(x));
```


- 각 클릭에 대하여 초당 0에서 9까지 카운트 되지만, 2개의 동시 타이머만 허용합니다.
(여러번 클릭할 경우 2개의 새로운 interval이 생성되고 실행)

```js
const clicks = fromEvent(document, 'click');
const higherOrder = clicks.pipe(
  map((ev) => interval(1000).pipe(take(10))),
);
const firstOrder = higherOrder.pipe(mergeAll(2));
firstOrder.subscribe(x => console.log(x));
```

<br/>
<br/>

## concatAll

> concatAll(): Observable


중첩 된 Observables(Observable-of-Observables)에 대한 concat, 이전의 것이 완료될 떄 각각의 것을 구독하고 emit 된 값을 병합


소스에 의해 emit 된 Observable(상위의 Observable) 을 직렬 방식으로 결합합니다. 이전 Observable 내부가 완료된 이후에만 각 내부의 Observable을 구독하고 모든 값을 반환된 observable에 병합합니다.

**Warning** : 만약 Observable 소스가 Observable을 빠르고 끊임없이 emit 하고, 일반적으로 소스가 emit하는 것보다 내부의 Observable이 늦게 emit 한다면, Observable이 무제한 버퍼에 수집되므로 메모리 이슈가 발생할 수 있습니다.

`concatAll`은 동시성 매개변수가 1로 설정된 `mergeAll`과 동일합니다.

##### Example

각 클릭 이벤트에 대해서 **동시성 없이** 0부터 3까지 매초마다 발생
(여러번 클릭할 경우 클릭한 횟수대로 차례대로 0~3 발생)
```js
const higherOrder = fromEvent(document, 'click').pipe(
    map(ev => interval(1000).pipe(take(4))),
);
const firstOrder = higherOrder.pipe(concatAll());
firstOrder.subscribe(x => console.log(x));
// document를 클릭 할 때마다 1000ms의 간격으로 0에서 3까지의 값을 emit합니다.
// 0
// 1
// 2
// 3
```

<br/>
<br/>

## exhaust

> exhaust(): Observable

현재 내부가 아직 실행 중일 때 중첩된 Observable(Observable-of-Observables) 을 다음 내부의 Observable을 삭제하여 병합합니다.

`exhaust`는 `mergeAll` 과 비슷하게 동작합니다. 그러나 `exhaust` 는 이전 Observable이 아직 완료 되지 않은 경우에는 모든 새로운 Observable을 무시합니다.
완료되면 내부 Observable의 다음을 받아들이고 평평하게하며, 이 과정을 반복합니다.

##### Example

현재 활성화된 timer가 없는 경우에만 각 클릭에 대하여 timer를 실행합니다.
(여러번 클릭할 경우 이전 timer가 있다면, 발생하지 않음)
```js
const clicks = fromEvent(document, 'click');
const higherOrder = clicks.pipe(
  map((ev) => interval(1000).pipe(take(5))),
  exhaust()
);
higherOrder.subscribe(x => console.log(x));
```

<br/>
<br/>

## startWith

> startWith(an: Values): Observable

- an : 먼저 방출할 값들

argumnets를 순서대로 먼저 내보낸 다음, 소스에서 발생하는 모든 값을 방출합니다.


##### Example
"first", "seconed"를 먼저 방출시킵니다.

```js
of("from source")
  .pipe(startWith("first", "second"))
  .subscribe(x => console.log(x));

// output:
// first
// second
// from source
```

<br/>
<br/>

## withLatestFrom

> withLatestFrom(other: Observable, project: Function): Observable

- other : 결합할 다른 Observable

Observable과 withLatestFrom에 전달된 Observable이 결합하며, 결합된 옵저버블은 withLatestFrom 을 호출한 Observable이 방출될때만 각각의 최신(마지막) 값으로 부터 계산되어 만들어집니다.


`withLatestFrom` 은 소스가 값을 방출하는 경우에만 Observable 소스의 각 값을 withLatestFrom에 전달된 Observable의 마지막 값과 결합합니다.

##### Example

모든 클릭 이벤트에 대하여 마지막 타이머의 값과 click 이벤트를 더한 array를 emit

```js
const clicks = fromEvent(document, 'click');
const timer = interval(1000);
const result = clicks.pipe(withLatestFrom(timer));
result.subscribe(x => console.log(x));

//output ex) 5초 뒤에 클릭, 14초 뒤에 클릭 할 경우
// [MouseEvent, 5]
// [MouseEvent, 14]
```

-----
### Reference
- <a href="https://rxjs-dev.firebaseapp.com/guide/operators">RxJS - Operators</a>
- <a href="https://gist.github.com/btroncone/d6cf141d6f2c00dc6b35">RxJS 5 Operators By Example(btroncone-git)</a>
