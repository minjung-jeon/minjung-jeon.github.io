---
layout: post
title: "[React] React 의 lifecycle"
date: '2022-02-23 10:00:00'
image: '/assets/res/react.png'
description: react 의 lifecycle, 각 함수 특징 및 사용방법
category: 'React'
tags:
- react
- frontend
- lifecycle
- SCU
author: minjnug
---

React 의 Component 에는 `Life Cycle(생명주기)` 이 존재한다. Component 가 생성(Mount), 업데이트(Update), 제거(UnMount) 될 때, 특정 이벤트가 발생하는 데 이를 Life Cycle 이라고 한다.

![placeholder](../assets/res/react/lifecycle.png "Life Cycle")


### constructor()

constructor 는 React 의 Component 가 처음 Mount 될 때 가장 먼저 호출되는 함수로, 생성자 함수이다.
해당 함수에서는 **state 초기화, 인스턴스에 이벤트 처리 바인딩** 을 할 수 있다.

```jsx
class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: 'min' }; // state 초기화
        this.handleClick = this.handleClick.bind(this); // 이벤트 바인딩
}
```

위의 예제와 같이 해당 함수의 첫 번째 라인에서는 반드시 `super(props)` 을 호출해야 한다. 이를 하지 않는다면 this.props가 생성자 내에서 정의되지 않아 오류가 발생 할 수 있다.

> constructor 에서 state 에 props 를 복사하면 안된다. 
```jsx
constructor(props) {
  super(props);
  this.state = { color: props.color };
}
```
이렇게 한다면 color props 가 변경되더라도 state에 반영되지 않아 버그를 일으킬 수 있다.


### render()

render 함수는 클래스형 컴포넌트에서 반드시 구현되어야 할 유일한 함수이다.
render 함수에서는 state 와 props 를 활용하여 아래의 목록 중 하나를 꼭 반환해야한다.

- React Element : React 의 DOM 노드 또는 사용자가 생성한 Component (ex. <div />, <Welcome />)
- 배열과 Fragment : 여러 개의 Element 를 반환([Fragment 참고링크](https://ko.reactjs.org/docs/fragments.html))
- [Portal](https://ko.reactjs.org/docs/portals.html)
- 문자열이나 숫자
- Boolean 또는 null : rendering 할 것이 없을 경우 null 이나 false 를 반환

주의 해야 할 점은 render 함수는 Pure 해야한다. 즉, Component 의 state 를 수정할 수 없으며 DOM 조작을 하면 안된다.

> 주의 : shouldComponentUpdate() 가 false를 반환하면 render()는 호출되지 않는다.

### componentDidMount()

componentDidMount 는 첫 번째 랜더링을 마친 후에 한번만 호출되는 함수이다.(DOM Mounting 이후)

DOM Node를 활용해야 하는 초기화 작업을 이 함수에서 작성할 수 있다. 또한 외부에서 데이터를 호출해야한다면, 이 함수에서 하는게 좋다. (ajax, D3 ...)

이 함수에서는 `setState` 를 호출 할 수 도 있는데, 이로 인한 추가 rendering은 브라우저가 화면을 갱신하기 전에 이루어 진다. (render 가 두 번 발생하게 되어 성능문제가 발생 하기 쉬우므로 주의 필요)


### static getDerivedStateFromProps()

> static getDerivedStateFromProps(props, state)

getDerivedStateFromProps 는 React 16.3 버전 이후에 생긴 함수로, Component 가 mount 될 때와 업데이트 될때(render 전) 호출된다. 주로 props 로 받아온 것을 state 에 반영하고 싶을 때 사용한다.
(반환 값은 state 갱신을 위한 객체나, 아무 것도 갱신하지 않기 위한 null)

이 함수는 다른 lifeCycle 함수와 달리 `static` 함수이기 때문에 this 를 조회할 수 없다.

```jsx
class Welcome extends React.Component {
  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.name !== prevState.name) {
      return { name: nextProps.name }
    }
    return null
  }
}
```


### shouldComponentUpdate()

> shouldComponentUpdate(nextProps, nextState)

shouldComponentUpdate 는 props 나 state 가 변경될때, re-rendering 여부를 결정해주는 함수이다.

React 는 기본적으로 props 나 state 가 변경되면 항상 re-rendering 이 되는데, 이 함수를 이용해서 불필요한 re-rendering 을 막아 최적화를 할 수 있다.

현재의 props, state 와 nextProps, nextState 를 비교하여 true 혹인 false 를 반환하여 re-rendering 여부를 결정할 수 있다. true 가 반환되면 re-rendering을 수행하고, false 를 반환하면 re-rendering 을 하지 않는다.


false 가 반환된다면, **componentWillUpdate(), render(), componentDidUpdate()** 는 호출되지 않는다.

```jsx
class Welcome extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.name !== this.props.name;
  }
}
```

만약 부모 component 에서 re-rendering이 된다면, 자식 Component 에서도 render 가 된다.

Hook 에서도 `React.memo, useMemo` 를 활용하여 랜더링 성능을 개선할 수 있다.


(shouldComponentUpdate() 대신에 PureComponent를 사용하는 것이 좋다. [PureComponent](https://ko.reactjs.org/docs/react-api.html#reactpurecomponent)는 props와 state에 대하여 얕은 비교를 수행하고, 해야 할 갱신 작업을 건너뛸 확률을 낮춤.)


### componentDidUpdate()

> componentDidUpdate(prevProps, prevState, snapshot)

componentDidUpdate 함수는 Component 가 re-rendering 이 된 이후에(render() 함수 호출 이후) 즉시 호출되는 함수이다.(최초 rendering 때는 호출되지 않음)

Component 가 갱신된 이후 DOM 을 조작해야 한다면, 이 함수에서 수행하는게 좋다. 또한 이전 props 와 현재 props 를 비교하여 네트워크 요청을 보낼 수 있다.

```jsx
componentDidUpdate(prevProps) {
  if (this.props.userID !== prevProps.userID) {
    this.fetchData(this.props.userID);
  }
}
```

이 함수에서 setState 를 사용할 수 있지만, 조건문을 감싸지 않는다면 무한 re-rendering이 발생할 수 있기 때문에 주의해야한다.

shouldComponentUpdate() 함수가 false을 리턴한 경우에는 호출되지 않는다.

> 컴포넌트에서 getSnapshotBeforeUpdate()를 구현한다면, 해당 메서드가 반환하는 값은 componentDidUpdate()에 세 번째 "snapshot" 인자로 넘겨진다.(반환값이 없다면 해당 인자는 undefined)


### componentWillUnmount()

componentWillUnmount 함수는 component가 unmounted 되어 destroyed 직전에 호출된다.

사용했던 resource(이벤트, timer...) 를 clean 해야할 때 이 함수를 사용한다.



-----
### Reference
- <a href="https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/">React Lifecycle Methods Diagram</a>
- <a href="https://ko.reactjs.org/docs/react-component.html">React.Component</a>