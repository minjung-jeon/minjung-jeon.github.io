---
layout: post
title: "[React] 함수형, 클래스형 컴포넌트(Functional Components, Class Components)"
date: '2022-02-09 15:00:00'
image: '/assets/res/react.png'
description: 함수형, 클래스형 컴포넌트의 특징
category: 'React'
tags:
- react
- frontend
- Functional Components
- Class Components
author: minjnug
---

React 에서 Component 는 UI 를 더 작은 조각으로 나누는 독립적이고 재사용 가능한 코드블럭을 의미한다.

Component 는 `함수, 클래스` 두 가지 방식으로 작성할 수 있다.

## Functional Component

첫 번재 유형으로 Component 를 정의하는 가장 간단한 방법은 함수형 작성 방식이다.
함수형 Component 는 기본적으로 React 의 element(JSX)를 반환하는 JavaScript/ES6 함수 이며, 아래의 예제와 같이 사용한다.

```jsx
// props : 속성을 나타내는 데이터
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

const Welcome = (props) => { 
  return <h1>Hello, {props.name}</h1>; 
}
```

이후에 위의 Component 를 다른 곳에서 사용하기 위해서는 함수를 export 하는 코드가 필요하다.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

export default Welcome;
```

해당 함수를 import 하여 아래와 같이 사용할 수 있다.

```jsx
import Welcome from './Welcome';

function App() { 
  return (
    <div className="App">
      <Welcome />
    </div>
  );
}
```

Functional Component 의 특징 :

- JavaScript/ES6 함수이다.
- React element(JSX)를 반환해야 한다.
- naming convention 은 항상 대문자로 시작한다.
- 필요한 경우 props를 매개변수로 사용한다.


## Class Component

두 번째 유형의 Component 는 Class Component 이다. 

Class Component 는 JSX를 반환하는 ES6 의 클래스 형태이다. 위의 Welcome 예제를 Class 유형의 Component 로 변환하면 아래와 같이 된다.

```jsx
class Welcome extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}
```

함수형 Component 와 다른 점은 Class Component 에서는 JSX 를 반환하기 위한 `render()` 함수가 있어야한다.

그럼 Class Component를 사용하는 이유는 무엇일까?

### Class Component를 사용하는 이유

보통 **State** 때문에 Class 형식의 Component 를 사용한다.
(React 16.8 이전 버전에서는 함수형에서 State를 사용할 수 없음)

오직 UI 를 rendering 할때는 함수형 Component를 사용하지만, 데이터 관리 및 생명주기 등 을 사용하기 위해서는 Class Component를 사용해야만 한다.

그러나 이는 React **Hooks** 이 생기면서 바뀌었고, 이제는 함수형 Component 에서도 **State** 를 사용할 수 있게 되었다.


Class Component의 특징 :

- ES6 의 클래스 이며, React 컴포넌트 class를 정의하려면 React.Component를 상속받아야 한다.
- JSX 를 반환하기 위해 render() 함수가 있어야한다.


[Props 와 State 관련 글](../React-props-state)


-----
### Reference
- <a href="https://ko.reactjs.org/docs/react-component.html">React.Component</a>
- <a href="https://ko.reactjs.org/docs/components-and-props.html">Components와 Props
</a>
- <a href="https://www.freecodecamp.org/news/react-components-jsx-props-for-beginners">React Functional Components, Props, and JSX – React.js Tutorial for Beginners</a>