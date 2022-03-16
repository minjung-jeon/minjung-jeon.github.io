---
layout: post
title: "[React] React Hooks 개념 및 기초"
date: '2022-03-16 10:00:00'
image: '/assets/res/react.png'
description: React Hook 개념 및 기초(useState, useEffect)
category: 'React'
tags:
- react
- frontend
- jsx
- Hook
- useState
- useEffect
author: minjnug
---

React Hook 은 v16.8 부터 새로 추가된 기능이다. 

기존에는 State 및 여러 React 의 기능을 사용하기 위해서는 Class 바탕의 Component 로 구현을 했어야 했지만, `Hook` 을 사용하여 함수형 Component 에서도 State 및 여러 React 의 기능을 사용할 수 있게 되었다.

### Hook 의 특징

1. **Component 사이에서 상태로직을 추상화 할 수 있다.**
<br/>
<br/>
    기존에 Component 간의 재사용 가능한 상태 로직을 붙이는 방법이 어려웠다. **render props** 나 **고차 컴포넌트(HOC, Higher Order Component)** 를 사용하여 이러한 문제를 해결해 왔지만, Hook 을 사용하면 Component 로 부터 상태 관련 로직을 추상화 하여 상태 공유를 쉽게 만들어준다.

2. **복잡한 컴포넌트를 작은 함수의 묶음 component 로 나눌 수 있다.**
<br/>
<br/>
    기존에는 각 생명주기 메서드에 관련 없는 로직들이 서로 섞여 있어 버그가 쉽게 발생하고 무결성을 해치는 코드가 되었다. 이 때문에 React 를 별도의 상태 관리 라이브러리와 함께 사용해왔는데, 라이브러리 대신 Hook 을 통해(구독 설정 및 데이터 호출 로직) 작은 함수의 묶음으로 Component를 나눌 수 있게 되었다.

3. **Class 없이 React 기능들을 사용할 수 있다.**
<br/>
<br/>
    기존의 React 에서 Class 를 사용하기 위해 **this** 키워드가 어떻게 동작하는지 알아야했다. 또한 React 내의 함수와 Class Component 의 구별, 각 요소의 사용 타이밍 등은 React 개발자 사이에서도 의견이 일치하지 않았으며, Class 는 코드의 최소화를 힘들게 만들고 Hot reloading 이 정상동작 하지 않게 만들기도 한다. 이러한 문제를 해결하기 위해서 Hook 은 Class 없이 React 의 기능들을 사용하는 방법들을 제시한다. 

> Hook 사용 규칙
- 최상위 에서만 Hook 을 호출해야 한다.(반복문, 조건문, 중첩 함수 내에서 Hook 실행X)
- React 함수 Component 내에서만 Hook을 호출해야 한다.


### useState

`useState` 는 Hook 에서 가장 기본이 되는 함수로 인자로 초기 state 값을 하나 받고, 현재의 state 값과 이 값을 업데이트 하는 함수를 같이 제공한다.
이는 this.setState 와 유사하지만, 이전 state와 새로운 state 를 합치지 않는다는 차이점이 있다.

```jsx
const Example = (props) => {
  // 여기서 Hook을 사용할 수 있습니다!
  return <div />;
}

function Example(props) {
  // 여기서 Hook을 사용할 수 있습니다!
  return <div />;
}
```
함수형 Component 를 사용하여 Hook 을 사용하는 방법은 위와 같이 2가지가 있으며, Hook 은 Class 안에서 동작하지 않는 특징이 있다.

**this.state 와 this.setState 를 사용한 class형 Component 예제**
```jsx
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

위의 예제를 Hook 을 활용하여 함수형 Component 로 수정해보자.


#### state 변수 선언 

useState 는 state 변수와 해당 변수를 업데이트 할 수 있는 함수를 반환한다. 이는 this.state.count 와 this.setState 와 유사하다. 또한 useState 로 넘겨주는 값은 state의 초기 값이다. 

```jsx
// 클래스형
this.state = {
    count: 0
};

// 함수형
const [count, setCount] = useState(0);
```

따라서 예제에서의 state 변수를 count 라고 선언을 했으며, count 의 초기 값을 0으로 선언 한 것이다.


#### state 사용

클래스 Component 에서는 `this.state.count` 를 사용했지만, 함수형 Component 에서는 Hook 을 사용하여 `count` 를 직접 사용할 수 있다.

```jsx
// 클래스형
<p>You clicked {this.state.count} times</p>

// 함수형
<p>You clicked {count} times</p>
```

#### state 업데이트 하기

클래스 Component 에서는 count 를 갱신하기 위하여 `this.setState()` 를 호출하지만, 함수형 Component 에서는 `setCount` 함수와 `count` 변수를 가지고 있으므로 this 를 사용하지 않고 state를 업데이트 할 수 있다.

```jsx
// 클래스형
<button onClick={() => this.setState({ count: this.state.count + 1 })}>
    Click me
</button>

// 함수형 
<button onClick={() => setCount(count + 1)}>
    Click me
</button>
```


#### Hook 을 사용하여 함수형 Component 로 변환한 결과

Hook 을 사용하여 state 변수 선언, state 사용, state 업데이트 하기 작업을 수행하여 함수형 Component 로 변환한다면, 다음과 같은 결과를 만들어 낼 수 있다.

```jsx
import React, { useState } from 'react';

function Example() {
    // useState 는 state 변수(count), 해당 변수를 갱신할 수 있는 함수(setCount) 두 가지를 반환한다.
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}
```



### useEffect

`useEffect` 는 함수 Component 내에서 데이터를 가져오거나 구독하고, DOM을 직접 조작하는 작업 등등 side effects 를 수행 할 수 있게 해준다.
클래스 Component 의 componentDidMount, componentDidUpdate, componentWillUnmount 와 같은 목적으로 제공되지만 하나의 api `useEffect`로 수행할 수 있게 해준다.
즉, Component 가 렌더링 이후에 어떤 일을 수행할지를 말한다.


**componetDidMount 와 componentDidUpdate를 활용한 Class형 Component 예제**

```jsx
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }
  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

위의 예제에서 두 개의 생명주기 method 안에 같은 코드가 중복되어 있다. 이 중복된 코드는 component 가 mount 된 단계, update 되는 단계 인지에 상관없이 렌더링 이후에는 항상 document.title 를 설정해준다.

이를 Hook의 `useEffect` 를 활용하여 함수형 Component 로 바꾸어보자.

```jsx
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

위의 코드처럼 useEffect 를 Component 내부에 둠으로써 count state 변수에도 접근 할 수 있게 된다. 또한 useEffect 는 첫번째 rendering 이후와 모든 업데이트 이후에 실행되게 된다. 

#### clean-up 을 이용하는 useEffect

위에서는 clean-up 이 필요하지 않은 effect 였지만, 메모리 누수가 발생하지 않도록 clean-up이 필요한 경우도 있다.
clean-up이 필요한 side effect 를 수행할 경우에 기존의 class component 에서의 방법과 Hook 을 사용하는 방법을 비교해보자.

**class 형 Component를 사용하는 예제**
```jsx
class FriendStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isOnline: null };
    this.handleStatusChange = this.handleStatusChange.bind(this);
  }

  componentDidMount() {
    ChatAPI.subscribeToFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
  componentWillUnmount() {
    ChatAPI.unsubscribeFromFriendStatus(
      this.props.friend.id,
      this.handleStatusChange
    );
  }
  handleStatusChange(status) {
    this.setState({
      isOnline: status.isOnline
    });
  }

  render() {
    if (this.state.isOnline === null) {
      return 'Loading...';
    }
    return this.state.isOnline ? 'Online' : 'Offline';
  }
}
```

기존의 Class 형 Component 에서는 componentDidMount 에서 구독을 한뒤 componentWillUnmount 에서 이를 clean-up 해준다. 두 가지 생명주기 내에는 개념상 같은 effect 에 대한 코드가 있지만 이를 따로 작성해야 구현이 가능하다.

이제 위의 Component 를 Hook 을 활용한 함수형 Component 로 바꾸어보자.

```jsx
import React, { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    // effect 이후에 어떻게 정리(clean-up)할 것인지 표시합니다.
    return function cleanup() {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

useEffect 는 구독의 추가와 제거를 위한 코드의 결합도를 높이기 위해 이를 함께 다루도록 고안되었다. useEffect 에서 함수를 반환하면 이는 clean-up이 필요할때에 실행되게 된다.

따라서 모든 effect는 clean-up을 위한 함수를 반환할 수 있다. clean-up을 수행하는 시점은 React 가 unmount 될 때이다.


#### useEffect 로 성능 최적화하기

componentDidUpdate 에서 prevProps 나 prevState 와의 비교를 통해 effect를 건너 뛸 수 있었다.

```jsx
componentDidUpdate(prevProps, prevState) {
  if (prevState.count !== this.state.count) {
    document.title = `You clicked ${this.state.count} times`;
  }
}
```

useEffect 에서도 effect를 건너 뛰기 위하여 선택적 인수인 두 번째 인수가 존재하는데, 이는 배열로 넘기면 된다.
```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); 
// count가 바뀔 때만 effect를 재실행합니다.
```

위와 같이 `[count]` 두 번째 인수로 넘기면, 현재 count가 5 이고 rerendering 이후에도 여전히 5 라면 배열 내의 모든 값이 (5 === 5) 같기 때문에 effect를 건너뛰게 된다.

> effect를 실행하고 이를 정리(clean-up)하는 과정을 (마운트와 마운트 해제 시에)딱 한 번씩만 실행하고 싶다면, 빈 배열([])을 두 번째 인수로 넘기면 된다. (빈 배열([])을 넘기게 되면, effect 안의 prop과 state는 초깃값을 유지) 


-----
### Reference
- <a href="https://ko.reactjs.org/docs/hooks-overview.html">Hook 개요</a>
- <a href="https://ko.reactjs.org/docs/hooks-state.html">Using the State Hook</a>
- <a href="https://ko.reactjs.org/docs/hooks-effect.html">Using the Effect Hook</a>