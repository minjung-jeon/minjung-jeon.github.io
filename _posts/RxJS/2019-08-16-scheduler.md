---
layout: post
title: "[RxJS] scheduler - Observable 연산자의 멀티스레딩"
date: '2019-08-16 15:00:00'
image: '/assets/res/rxjs.png'
description: RxJS Scheduler 멀티스레딩
category: 'RxJS'
tags:
- javascript
- ECMAScript
- frontend
- RxJS
twitter_text: RxJS Scheduler 멀티스레딩
introduction: RxJS Scheduler 멀티스레딩
---

## Scheduler

> Scheduler는 Observser가 Observable을 구독할 때 값을 전달받는 순서와 실행 컨텍스트를 관리합니다.(Observable 연산자 체인에 `멀티스레딩`을 적용하고 싶을때 사용합니다.)

자바스크립트 엔진은 기본적으로 싱글스레드, 이벤트 루프로 동작합니다. RxJS의 Scheduler는 비동기 처리를 어떠한 순서로 처리될지 구현되어 있습니다.

`Scheduler` 는 구독이 시작할때와 알림을 보낼때를 제어할 수 있으며, 3가지 component로 구성되어 있습니다.

1. Data Structure : 우선 순위 또는 다른 기준에 따라 작업을 저장하고 대기열에 넣습니다.
2. Execution Context : 작업이 언제 어디서 실행되는지 나타냅니다.( ex. 즉시 실행, setTimeout이나 process.nextTic과 같은 다른 콜백 메커니즘, 애니메이션 프레임)
3. (Virtual) Clock : getter 함수 now()에 의해 "time" 개념을 제공합니다. 특정 스케쥴러에서 스케쥴된 작업은 해당 clock 이 나타내는 시간에만 적용되게 됩니다.


### Scheduler Types

`async` Scheduler는 RxJS 가 제공하는 내장 스케쥴러 중 하나 입니다. 이들 각각은 Scheduler 개체의 static 속성을 사용하여 만들어지고 반환되어집니다.

> asyncScheduler

[rxjs asyncScheduler 공식문서](https://rxjs-dev.firebaseapp.com/api/index/const/asyncScheduler)

다른 스케쥴러(asap, queue)들이 상속받는 부모 스케쥴러로 `setTimeout(task, duration)`을 사용한 것처럼 일정 시간 이후에 실행되도록 만듭니다.

작업을 단순히 지연시키려는 경우, 즉 현재 실행중인 동기코드 종류 이후 setTimeout(deferredTask, 0)을 실행시킬 경우 `AsapScheduler` 를 사용하는게 좋습니다.


```js
import { asyncScheduler } from 'rxjs';

const task = () => console.log('it works!');

asyncScheduler.schedule(task, 2000);

// After 2 seconds logs:
// "it works!"
```

<br/>

> asapScheduler

[rxjs asapScheduler 공식문서](https://rxjs-dev.firebaseapp.com/api/index/const/asapScheduler)

작업을 비동기 적으로 수행 할 수 있는 한 빨리 수행합니다. (기본적으로 현재 작업 이후지만, 다음 작업 전)

현재 이벤트나 실행 로직 다음에 실행해야 할 이벤트 처리보다 더 빠르게 처리해야하는 작업이 있을 때 사용합니다.

```js
import { asapScheduler, asyncScheduler } from 'rxjs';

asyncScheduler.schedule(() => console.log('async')); // scheduling 'async' first...
asapScheduler.schedule(() => console.log('asap'));

// Logs:
// "asap"
// "async"
// ... but 'asap' goes first!
```

<br/>


> queueScheduler 

[rxjs queueScheduler 공식문서](https://rxjs-dev.firebaseapp.com/api/index/const/queueScheduler)

동기 방식의 스케쥴러로 큐를 사용하여 순서를 동기로 조절해야하는 특수한 상황에 사용합니다.(다소 실용성이 낮음)

다음 작업을 즉시 실행하는 대신에 큐에 담습니다. queue Schduler 가 지연과 함께 사용된다면, `async` 스케쥴러와 동일하게 동작합니다.

```js
import { queueScheduler } from 'rxjs';

queueScheduler.schedule(() => {
  queueScheduler.schedule(() => console.log('second')); // will not happen now, but will be put on a queue

  console.log('first');
});

// Logs:
// "first"
// "second"
```

<br/>





-----
### Reference
- <a href="https://rxjs-dev.firebaseapp.com/guide/scheduler">RxJS - Scheduler</a>
- <a href="http://reactivex.io/documentation/ko/scheduler.html">learnrxjs</a>
