---
layout: post
title: "[RxJS] Operators 3 - Utility Operators"
date: '2019-08-09 15:00:00'
image: '/assets/res/rxjs.png'
description: tap, delay, delayWhen, dematerialize, materialize, observeOn, subscribeOn, timeInterval, timestamp, timeout, timeoutWith, toArray
category: 'RxJS'
tags:
- javascript
- ECMAScript
- frontend
- RxJS
twitter_text: tap, delay, delayWhen, dematerialize, materialize, observeOn, subscribeOn, timeInterval, timestamp, timeout, timeoutWith, toArray
introduction: tap, delay, delayWhen, dematerialize, materialize, observeOn, subscribeOn, timeInterval, timestamp, timeout, timeoutWith, toArray
---

## tap

> tap(nextOrObserver: function, error: function, complete: function): Observable

- next(Optional) / error(Optional) / complete(Optional)

Observable의 생명주기 동안 발생하는 여러 이벤트에서 실행 될 액션을 등록합니다.(로깅과 같은 동작이나 side-effect를 투명하게 수행합니다.)

`tap` 은 Observable의 pipe 도중에 사용되며, Observable의 모든 방출에 대해 side-effect를 수행하지만 반환에 영향을 주지 않습니다.
이 operator는 정확한 값을 위한 디버깅을 하거나, 다른 side-effect(loading bar 등)을 수행하는데 유용합니다.

#### Example

```js
const source = of(1, 2, 3, 4, 5);

// tap은 map 객체를 받아서 next, error, complete를 기록할 수 있다. 
const example = source.pipe(
 map(val => val + 10),
 tap({
    next: (val) => {
      // on next 11, etc.
      console.log('on next', val);
    },
    error: (error) => {
      console.log('on error', error.message);
    },
    complete: () => console.log('on complete')
  })
)
.subscribe(val => console.log(val));
// output : 
// on next 11
// 11
// on next 12
// 12
// on next 13
// 13
// on next 14
// 14
// on next 15
// 15
// on complete
```

<br/>
<br/>

## delay

> delay(delay: number, Date, scheduler: Scheduler): Observable

- delay : 지연 시킬 시간(milliseconds)이나 날짜 / scheduler(optional) : 기본 값은 async
<br/>(scheduler는 각 항목의 시간 이동을 처리하는 타이머를 관리하는데 사용)


주어진 timeout 이나 날짜 까지 Observable의 emission을 지연시킵니다.

delay 인수가 Number 일 경우 연산자 시간은 밀리초 단위로 표시된 시간만큼 Observable의 소스를 이동시킵니다. 값 사이의 상대적인 시간 간격은 보존됩니다.
지연 인수가 날짜인 경우 이 연산자 시간은 주어진 날짜가 발생할 때까지 Observable 실행의 시작을 이동합니다.

#### Example

- 각 클릭을 1초 지연

```js
const delayedClicks = fromEvent(document, 'click').pipe(delay(1000)); // each click emitted after 1 second
delayedClicks.subscribe(x => console.log(x));
```


- 미래의 날짜가 발생할 때 까지 모든 클릭을 지연

```js
const date = new Date('March 15, 2050 12:00:00');
const delayedClicks = fromEvent(document, 'click').pipe(delay(date)); // click emitted only after that date
delayedClicks.subscribe(x => console.log(x));
```

<br/>
<br/>

## delayWhen

> delayWhen(delayDurationSelector: Function, subscriptionDelay: Observable): Observable

- selector : 이 함수에서 반환 된 Observable 은 방출을 지연시킬때 사용합니다. / sequence(optional) 

`delay`와 비슷하지만 `delayWhen` 의 지연 지속시간은 첫번 째 인수로 제공된 함수의 Observable 의해 결정됩니다.
또한 delayWhen 은 선택적으로 `subscriptionDelay` 라는 두 번째 인수를 받습니다. 
`subscriptionDelay`은 첫 번째 값을 emit하거나 완료되면 observable 소스를 구독하고 동작을 시작합니다. subscriptionDelay 가 제공되지 않으면 delayWhen은 Observable 출력이 구독되는 즉시 Observable 소스에 구독합니다.


#### Example

```js
//emit value every second
const message = interval(1000);
//emit value after five seconds
const delayForFiveSeconds = () => timer(5000);
// 5초 후에, 매초 발생하는 interval 의 emitting을 시작
const delayWhenExample = message.pipe(delayWhen(delayForFiveSeconds));
const subscribe = delayWhenExample.subscribe(val => console.log(val));

// 5초의 지연 후에 로그가 시작
// output : 1 2 3 4 ... 
```

<br/>
<br/>

## dematerialize

> dematerialize(): Observable

`dematerialize`은 Notification 객체를 Notification 값으로 변환합니다.(materialize 의 반대)
즉, 배출된 항목이 어떤 알림을 통해 옵저버에게 전달 됐는지를 표현할 수 있습니다.
`dematerialize`은 next emissions으로 오직 Notification 객체를 방출하는 Observable을 작동시킵니다. 

#### Example

- 알림을 값으로 변환

```js
//emit next and error notifications
const source = from([
  Notification.createNext('SUCCESS!'),
  Notification.createError('ERROR!')
]).pipe(
  dematerialize() // 알림 객체를 값으로 변환
);

const subscription = source.subscribe({
  next: val => console.log(`NEXT VALUE: ${val}`),
  error: val => console.log(`ERROR VALUE: ${val}`)
});
// output: 
// NEXT VALUE: SUCCESS!
// ERROR VALUE: ERROR!
```

- Notification 의 Observable을 실제의 Observable로 변환

```js
const notifA = new Notification('N', 'A');
const notifB = new Notification('N', 'B');
const notifE = new Notification('E', undefined,
  new TypeError('x.toUpperCase is not a function')
);
const materialized = of(notifA, notifB, notifE);
const upperCase = materialized.pipe(dematerialize());
upperCase.subscribe(x => console.log(x), e => console.error(e));
 
// Results in:
// A
// B
// TypeError: x.toUpperCase is not a function
```

<br/>
<br/>

## materialize

> materialize(): Observable

`materialize`은 Observable의 출력에서 next에 의해 방출되는 Notification 객체의 next, error, complete 를 래핑합니다.
Observable 소스가 완료되면, 출력은 'complete' 유형의 알림이 next로 방출되고, 그 후에 complete로 방출됩니다. Observable 소스에서 오류가 발생하면 출력은 'error' 유형의 알림으로 next로 인해 출력되고, 그 후에 complete 됩니다.


#### Example

```js
const letters = of('a', 'b', 13, 'd');
const upperCase = letters.pipe(map(x => x.toUpperCase()));
const materialized = upperCase.pipe(materialize());
materialized.subscribe(x => console.log(x));
 
// Results in the following:
// - Notification {kind: "N", value: "A", error: undefined, hasValue: true}
// - Notification {kind: "N", value: "B", error: undefined, hasValue: true}
// - Notification {kind: "E", value: undefined, error: TypeError:
//   x.toUpperCase is not a function at MapSubscriber.letters.map.x
//   [as project] (http://1…, hasValue: false}
```

<br/>
<br/>

## observeOn

> observeOn(scheduler: Scheduler, delay: number): Observable

- delay (Optional) : number

Observer 가 어느 스케쥴러 상에서 Observable을 관찰할지 명시합니다.(사용할 scheduler를 바꾸고자 할 때 사용)

[observeOn, subscribeOn 참고 URL](http://blog.weirdx.io/post/26576)

<br/>
<br/>

## subscribeOn

> subscribeOn(scheduler: Scheduler): Observable

Observable을 구독할 때 사용할 스케줄러를 지정합니다.(사용할 scheduler를 바꾸고자 할 때 사용)

[observeOn, subscribeOn 참고 URL](http://blog.weirdx.io/post/26576)

<br/>
<br/>

## timeInterval

> timeInterval(scheduler: *): Observable<TimeInterval> | WebSocketSubject<T> | Observable<T>

항목들을 배출하는 Observable을, 항목을 배출하는데 걸린 시간이 얼마인지를 가리키는 Observable로 변환

#### Example
```js
fromEvent(document, 'mousedown')
  .pipe(
    timeInterval(),
    tap(console.log)
  )
  .subscribe(
    i =>
      (document.body.innerText = `milliseconds since last click: ${i.interval}`)
  );
```

<br/>
<br/>

## timestamp

> timestamp(scheduler: SchedulerLike = async)

- scheduler (Optional) : default 는 async.

Observable이 배출한 항목에 타임 스탬프를 추가합니다.

#### Example
클릭할 때 마다 timestamp 를 추가

```js
const clickWithTimestamp = fromEvent(document, 'click').pipe(
  timestamp()
);

// Emits data of type {value: MouseEvent, timestamp: number}
clickWithTimestamp.subscribe(data => {
  console.log(data);
});
```


<br/>
<br/>

## timeout

> timeout(due: number Date, scheduler: SchedulerLike = async)

소스 Obvservable을 그대로 전달하지만, Observable이 특정 시간 동안 배출된 항목이 없으면 오류 알림을 보냅니다.

#### Example

```js
const seconds = interval(1000);

seconds.pipe(timeout(1100))      // Let's use bigger timespan to be safe,
                                 // since `interval` might fire a bit later then scheduled.
.subscribe(
    value => console.log(value), // Will emit numbers just as regular `interval` would.
    err => console.log(err),     // Will never be called.
);

seconds.pipe(timeout(900))
.subscribe(
    value => console.log(value), // Will never be called.
    err => console.log(err),     // Will emit error before even first value is emitted,
                                 // since it did not arrive within 900ms period.
);
```

<br/>
<br/>

## timeoutWith

> timeoutWith(due: number Date, withObservable: ObservableInput, scheduler: SchedulerLike = async)

주어진 시간 범위에서 방출이 발생하지 않으면, 두번째 Observable을 구독합니다.


#### Example
1초마다 발생하는 `seconds` Observable에 timeoutWith 의 시간 범위를 900ms 로 걸면, timeout이 발생하여 두 번째 Observable인 `minutes` 을 구독하여 방출하게 됩니다.

따라서 6초에 한번 씩 value 값이 출력됩니다.

```js
const seconds = interval(1000);
const minutes = interval(6 * 1000);
 
seconds.pipe(timeoutWith(900, minutes))
  .subscribe(
    value => console.log(value), // After 900ms, will start emitting `minutes`,
                                 // since first value of `seconds` will not arrive fast enough.
    err => console.log(err),     // Would be called after 900ms in case of `timeout`,
                                 // but here will never be called.
  );
```

<br/>
<br/>

## toArray

모든 소스의 결과물을 수집하고, 소스가 complete 되면 이를 Array로 방출합니다.

[잠금화면의 패턴에 활용할 수 있음](https://stackblitz.com/edit/rxjs-lockscreen?file=index.ts&devtoolsheight=30)

#### Example

```js

interval(100)
  .pipe(
    take(10),
    toArray()
  )
  .subscribe(console.log);
//output:
// [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

-----
### Reference
- <a href="https://rxjs-dev.firebaseapp.com/guide/operators">RxJS - Operators</a>
- <a href="https://www.learnrxjs.io/operators/utility/do.html">learnrxjs</a>
- <a href="http://reactivex.io/documentation/ko/operators.html">ReactiveX</a>
