---
layout: post
title: "[React] React 의 Props, State"
date: '2022-02-16 10:00:00'
image: '/assets/res/react.png'
description: react 의 Props, State
category: 'React'
tags:
- react
- frontend
- props
- state
- useState
author: minjnug
---

props 와 state 는 React 에서 데이터를 다룰 때 사용하는 개념이다.

> props : 부모에서 자식 컴포넌트로 데이터를 넘겨줄 때 사용하며, 직접적으로 수정 할 수 없는 값이다.

> state : Component 내부에서 관리하는 데이터로, 변경이 가능한 값이다.

## Props

React 에서 한 Component 에서 다른 Component 로 데이터를 전송할 때, 사용하는 특수 객체가 props 이다. 

#### 단방향 데이터 흐름

그러나 `Props는 단방향으로 데이터를 전송한다는 특징`이 있다. 그러므로 자식에서 부모로, 동일한 레벨의 Component로 Props를 전달하는 것은 불가능하다.

props 로 데이터를 전달하는 방법은 우선 Component에 prop을 정의하고 값을 할당해야한다.

```jsx
import Welcome from './Welcome';

function App() { 
  return (
    <div>
      <Welcome name="Sara"/>
    </div>
  );
}
```

여기에서 Welcome 은 App의 자식 Component 이므로, 값을 전달하고 "name" 에 접근하여 값을 가져 올 수 있다.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

class Welcome extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>;
    )
  }
}
```

React 는 {name: 'Sara'} 를 Props 로 하여 Welcome Component를 호출하고, Welcome Component 는 `<h1>Hello, Sara</h1>` 컴포넌트를 반환하게 된다.

#### props 의 재사용

```jsx
import Welcome from './Welcome';

function App() {
  return (
    <div>
      <Welcome name="Sara" />
      <Welcome name="Cahal" />
      <Welcome name="Edite" />
    </div>
  );
}
```

위의 예제처럼 Welcome Component 에 다른 props를 전달하여, 같은 패턴으로 여러번 출력되므로 효율적으로 재사용이 가능하다.

#### props 의 데이터 형태

Props 에 숫자, Boolean, 배열 등 다양한 형태의 데이터를 전달할 수 있는데, 문자를 제외하고는 `{}`로 감싸서 데이터를 전달해야한다.

```jsx
import Welcome from './Welcome';

function App() {
  return (
    <div>
      <Welcome name={["Sara", "Cahal", "Edite"]} />
    </div>
  );
}
```

#### Props 는 읽기 전용 객체이다.

Props의 중요한 특징 중 하나는 `읽기 전용의 객체`이라는 것이다.

Component 내에서 자체 props 를 수정해서는 안된다. 입력한 값을 수정하지 않는 것을 순수 함수 라고 하는데, props도 순수함수 처럼 동작해야한다.

> 모든 React 컴포넌트는 자신의 props를 다룰 때 반드시 순수 함수처럼 동작해야 합니다. - reactjs.org

그러나 UI 는 동적이며, 사용자 액션, 네트워크 응답 및 다른 요소에 의해 출력이 변화될 수 있다. 그리하여 React는 `state` 를 통해 위의 규칙을 위반하지 않고 동적으로 시간에 따라 UI를 변화시킨다.


#### defaultProps, propTypes
 
defaultProps 프로퍼티를 할당하여 props 의 초기값을 정의할 수 있으며, `prop-types` 를 통하여 props의 타입을 확인 할 수 있다.

```jsx
import PropTypes from 'prop-types';

class Greeting extends React.Component {
  render() {
    return (
      <h1>Hello, {this.props.name}</h1>
    );
  }
}

Greeting.defaultProps = {
  name: 'min'
};

Greeting.propTypes = {
  name: PropTypes.string
};
```


## State

state 는 Component 내부에서 관리하며, 상태에 따라 변하는 동적 데이터 이다.
state 는 props 와 다르게 자동으로 생성되지 않아 명시적으로 state 를 기술 해야 한다.

#### 클래스형, 함수형 Component 에서의 State 사용

클래스형 Component 에서는 아래와 같은 방식으로 state 를 정의할 수 있다.

```jsx
// 1.
class Greeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'min'
    };
  }
}

// 2.
class Greeting extends React.Component {
  state = {
    name: 'min'
  }
}
```

함수형 Component 에서는 Hook의 `useState` 을 사용하여 state 를 관리할 수 있다.
`useState` 는 상태 유지 값과 그 값을 갱신하는 함수를 반환한다.

> const [state, setState] = useState(initialState);

```jsx
function Greeting() {
  // useState 의 첫 번째 값은 initialState, 두 번째는 Setter 함수
  const [name] = useState('min');
}
```

#### setState 함수

state 값을 변경할 때는 setState 함수를 사용한다. 그리고 setState 를 사용하여 `state 가 변경되면 컴포넌트는 리렌더링` 된다.
setState 는 `비동기적`으로 이루어진다. 그러므로, setState 호출 직후 새로운 값이 바로 this.state 에 반영되지 않는다.
이때, callback 을 사용하여 업데이트 된 state 를 사용할 수 있다.

[setState 관련 react 공식](https://ko.reactjs.org/docs/react-component.html#setstate)

> setState(updater, [callback])

첫 번째 인자인 updater 에는 `(state, props) => stateChange` 의 형태이며, 이때 state는 변경 사항이 적용되는 시점에 component 가지는 state에 대한 참조이다.


- `Function` 의 형태로 set 하는 경우

```jsx
class Counter extends React.Component {
  state = {
    counter: 0
  };

  updateCounter() {
      // props.step 만큼 state의 counter 를 증가시킨다.
      this.setState((state, props) => {
        return {
          counter: state.counter + props.step
        };
      });
  }
}
```

- `Object` 의 형태로 set 하는 경우

```jsx
this.setState({counter: 10});
```

두 번째 인자인 `callback` 은 optional 한 인자로 callback 을 명시한다면, setState() 가 완료 된 후 component가 re-rendered 된 이후에 실행되게 된다.

```jsx
incrementCount() {
  this.setState((state) => {
    // 중요: 값을 업데이트할 때 `this.state` 대신 `state` 값을 읽어옵니다.
    return {count: state.count + 1}
  });
}

handleSomething() {
  // `this.state.count`가 0에서 시작한다고 가정해보면
  this.incrementCount(); 
  this.incrementCount();
  this.incrementCount();

  // 각각의 line 의 함수 실행에 의해 this.state.count 가 3이 될 것 같지만
  // 지금 `this.state.count` 값을 읽어 보면 이 값은 여전히 0 이다.
  console.log(this.state.count);
  
  // 하지만 React가 컴포넌트를 리렌더링하게 되면 이 값은 3이 된다.
}
```

위의 예제에서 count 증가 시점에 count 값을 사용하고 싶다면, callback 함수를 사용하여 해결할 수 있다.


```jsx
incrementCount() {
  this.setState((state) => {
    return {count: state.count + 1}
  }, () => {
    // count 를 업데이트 할때 마다 업데이트 된 값을 사용 할 수 있다.
    console.log(this.state.count); 
  });
}
```

#### 중첩 객체의 state 변경

setState 는 중첩 된 객체의 업데이트를 지원 하지 않는다. 

```jsx
this.state = {
  number: 0,
  foo: {
    bar: 0,
    foobar: 1
  }
}

this.setState({
  foo: {
    foobar: 2
  }
});
```
중첩 객체의 state 를 업데이트 할때, 위와 같이 전달한다고 해서 foo 객체의 foobar값이 2로 바뀌지 않는다.

foobar값이 2로 바뀌지 않고 기존의 foo객체 자체가 바뀌어버린다.


그리하여 중첩된 객체의 state를 변경할 땐, 객체를 복사하여 원하는 데이터로 수정 후 업데이트 하는 방법을 사용한다.

```jsx
// 1.
this.setState({
  number: 0,
  foo: {
    ...this.state.foo,
    foobar: 2
  }
});

// 2.
this.setState((prevState) => {
  // Object.assign메소드로 foo 변수를 복사
  let tempList = Object.assign({}, prevState.foo);
  
  // foo 속성을 바꾸고자 하는 상태(newList)로 업데이트
  tempList.foo = {
    bar: 0,
    foobar: 1
  };
  
  // 새로운 객체를 리턴
  return { tempList };
});
```

중첩 객체일때, 위의 예제와 같이 수정한다면 원하는 값만 수정되는 결과를 얻을 수 있다.

-----
### Reference
- <a href="https://ko.reactjs.org/docs/components-and-props.html">Components와 Props</a>
- <a href="https://ko.reactjs.org/docs/state-and-lifecycle.html">State and Lifecycle</a>
- <a href="https://ko.reactjs.org/docs/typechecking-with-proptypes.html">PropTypes와 함께 하는 타입 검사</a>
