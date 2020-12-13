---
layout: post
title: "[React] [번역] Why React16 is a blessing to React developers"
date: '2018-10-03 15:00:00'
image: '/assets/res/react.png'
description: React16 주요 변경 사항
category: 'React'
tags:
- react
- frontend
twitter_text: React16 주요 변경 사항
introduction: React16 주요 변경 사항
---

**<a href="https://medium.freecodecamp.org/why-react16-is-a-blessing-to-react-developers-31433bfc210a">Why React16 is a blessing to React developers</a>**

다음은 React15에서 React16으로 기존 앱을 마이그레이션할 때 고려야해야 할 몇 가지 유용한 기능입니다.


## Error Handling

React16은 새로운 Error Boundary 개념을 도입합니다.

Error Boundary 는 자식 Component 트리에서 JavaScript 오류를 잡는 React 의 Component 입니다.
오류를 기록하고 충돌난 Component 트리가 아닌 대체 UI를 표시합니다. Error Boundary 는 랜더링, 라이프 사이클 메소드 및 그 아래의 전체 트리의 constructor 에서 오류를 수집합니다.
  
  
클래스 component 는 `componentDidCatch(error, info)` 라는 새로운 생명주기 메소드를 정의하면 Error Boundary 가 됩니다.

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

그런 다음 일반 component 로 사용 할 수 있습니다.

```jsx
<ErrorBoundary>  
   <MyWidget />
</ErrorBoundary>
```

`componentDidCatch()` 함수는 components 를 제외하고는 JavaScript 의 `catch{}` 블록처럼 작동합니다. 클래스 components 만 Error Boundary 가 될 수 있습니다.
실제로는 대부분 한 번 Error Boundary component 를 선언합니다. 그런 다음 어플리케이션 전반에 걸쳐 사용합니다.

Error Boundary 는 트리 아래의 component 에서만 오류를 감지합니다. Error Boundary 는 그 자체의 오류를 잡을 수 없습니다.
Error Boundary 가 오류 메시지를 렌더링하지 못한다면, 그 오류는 그 위에 있는 가장 가까운 Error Boundary 에 전파됩니다. 이것은 JavaScript 에서 catch{} 블록이 동작하는 것과 비슷합니다.


## New render return types: fragments and strings

랜더링하는 동안 div의 component 를 래핑하지 않아도 됩니다.

이제 component 의 render 메소드에서 요소 배열을 반환 할 수 있습니다. 다른 배열과 마찬가지로, 키 경고를 피하기 위해서 각 요소에 키값을 추가해야합니다.

React 16.2.0 부터는 키를 필요로하지 않는 JSX에 대한 특별한 fragment 를 지원합니다.


문자열 반환을 지원합니다 :

```jsx
render() {
  return 'Look ma, no spans!';
}
```

## Portals

Portal 은 parent component 의 DOM 계층 구조 외부 존재하는 DOM 노드를 하위 항목을 렌더링하는 최고의 방법을 제공합니다. 

```jsx
ReactDOM.createPortal(child, container)
```

첫 번째 인수(child) 는 요소, 문자열 또는 fragment 와 같은 렌더링 가능한 React 하위 요소입니다. 두번째 인수(컨테이너)는 DOM 요소입니다.

#### How to use it

요소의 렌더 메소드에서 요소를 반환하면 가장 가까운 부모 노드의 하위 노드로 DOM에 마운트 됩니다. 

```jsx
render() {
  // React mounts a new div and renders the children into it
  return (
    <div>
      {this.props.children}
    </div>
  );
}
```

때로는 자식을 DOM의 다른 위치에 삽입하는 것이 유용할 때도 있습니다.

```jsx
render() {
  // React does *not* create a new div. It renders the children into `domNode`.
  // `domNode` is any valid DOM node, regardless of its location in the DOM.
  return ReactDOM.createPortal(
    this.props.children,
    domNode
  );
}
```

Portal 의 일반적인 사용 사례는 부모 구성 요소에 `overflow:hidden` or `z-index` 스타일이 있지만, 컨터이너에서 시각적으로 "break out"(차단) 해야하는 경우입니다.
예를 들어, 대화상자, 호버카드, 툴팁입니다.


## Custom DOM Attribute

React15 는 알려지지 않은 DOM속성을 무시하는데 사용됩니다. React가 그것을 인식하지 못했기 때문에 그냥 건너 뛸 것입니다. 

```jsx
// Your code:
<div mycustomattribute="something" />
```

React15 를 사용하여 DOM에 빈 div를 랜더링 합니다.

```jsx
// React 15 output:
<div />
```

React16 에서 출력은 다음과 같습니다.
(커스텀 속성이 표시되고 무시되지 않습니다.)

```jsx
// React 16 output:
<div mycustomattribute="something" />
```

## Avoid Re-render with setting NULL in state

React16 을 사용하면 상태 업데이트를 방지할 수 있고, `setState()`에서 다시 렌더링 할 수 있습니다. 함수에 return `null`만 해주면 됩니다.

```jsx
const MAX_PIZZAS = 20;

function addAnotherPizza(state, props) {
  // Stop updates and re-renders if I've had enough pizzas.
  if (state.pizza === MAX_PIZZAS) {
    return null;
  }

  // If not, keep the pizzas coming! :D
  return {
    pizza: state.pizza + 1,
  }
}

this.setState(addAnotherPizza);
```

## Creating Refs

React16을 사용하여 참조를 만드는 것이 더 쉬워졌습니다. 참조를 사용해야하는 이유:

- 포커스, 텍스트 선택, 미디어 재생 관리
- 명령 애니메이션 트리거.
- 서드파티 DOM 라이브러리와의 통합

참조는 `React.createRef()` 를 사용하여 만들어지며 참조 속성 를 통해 React 요소에 연결됩니다.
참조는 일반적으로 component 가 구성될 때 component 전체에 참조될 수 있도록 인스턴스 속성에 할당됩니다.

```jsx
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }
  render() {
    return <div ref={this.myRef} />;
  }
}
```

#### Accessing Refs

참조가 랜더의 요소에 전달되면, 참조의 현재 속성에서 노드에 대한 참조가 액세스 가능해집니다.

```js
const node = this.myRef.current;
```

참조의 값은 노드의 유형에 따라 다릅니다. :

HTML 요소에서 참조 특성을 사용하면, `React.createRef()` 를 사용하여 생성자를 만든 참조는 기본 DOM 요소를 현재 속성으로 받습니다.
사용자 정의 클래스 구성 component 에 참조 특성이 사용되는 경우 참조 개체는 마운트 된 component 의 인스턴스를 받습니다.
함수형 component 에는 인스턴스가 없기 때문에 ref 속성을 사용할 수 없습니다.


## Context API

Context 를 사용하면 모든 레벨에 수동으로 props 를 전달할 필요 없이 component tree 를 통하여 데이터를 전달할 수 있습니다.

#### React.createContext

```jsx
const {Provider, Consumer} = React.createContext(defaultValue);
```

`{ Provider, Consumer }` 을 짝으로 생성합니다. React 가 Context Consumer 를 랜더할 때, tree 에서 가장 가깝게 일치하는 Provider 부터 현재 context 값을 읽습니다.

defaultValue 인수는 tree 에서 일치하는 Provider 가 없는 경우에만 Consumer 에 의해 사용됩니다.
이는 wrapping 하지 않고 component 를 개별적으로 테스트하는데 유용할 수 있습니다.
Note: undefined 를 Provider 의 값으로 전달하면 Consumer 는 `defaultValue` 를 사용하지 않습니다.
 

#### Provider

```jsx
<Provider value={/* some value */}>
```

Consumer 가 context 변경사항을 알 수 있게 해주는 React Component.

이 Provider 의 아래의 Consumer 로 전달할 value prop 을 가지고있습니다. 하나의 Provider 는 많은 Consumer 와 연결 될 수 있습니다. 
Provider 은 더 깊은 tree 내에 값들을 override 하기 위해 중첩될 수 있습니다.


#### Consumer

```jsx
<Consumer>
  {value => /* render something based on the context value */}
</Consumer>
```

Context 변경사항을 구독(?)하는 React Component.

자식으로의 함수가 필요합니다. 그 함수는 현재 context 을 받고 React node 를 반환합니다. 함수에 전달된 값은 tree 안에서 context 에 가장 가까운 Provider 의 value props 와 같습니다.
context 에 대한 Provider 가 없는 경우 value 인자는 `createContext()` 에 전달 된 defaultValue 가 될 것입니다.


## static getDerivedStateFromProps()

`getDerivedStateFromProps` 는 render 메소드를 호출하기 전에 호출됩니다. 초기 마운드 및 후기 업데이트에 모두 적용됩니다. 상태를 업데이트하기 위해 object 를 반환하거나, 아무것도 업데이트 하지 않으려면 null 을 반환해야합니다. 

이 메소드는 state 가 props 변화에 의존하는 드문 케이스를 위해 존재합니다. 예를 들어, 이전과 다음 children 을 비교하여 어느 부분에서 애니메이션을 적용할지 결정하는 <Transition> Component 를 구현하는 것이 편리할 수 있습니다. 

state 를 파생하면 코드가 장황해지고, component 를 생각하기 어렵게 만듭니다.

다음과 같은 간단한 대안을 숙지해야합니다.

- props 의 변경에 대한 응답으로 부작용(ex, 데이터 fetching 또는 애니메이션)을 수행해야 하는 경우에 대신 `componentDidUpdate` lifecycle 을 사용하세요.
- props 가 변경 될 때 일부 데이터를 다시 계산하기 위해서는 memoization helper 를 사용하세요.
- props 가 변경 될 때 일부 state 를 "reset" 하려면 키를 사용하여 component 를 완전히 완전히 제어하거나 완전히 제어되지 않은 상태로 만드는 것을 고려해야합니다. 

이 함수는 component instance 에 접근 할 수 없습니다. 만약 원하는 경우가 있다면, 클래스 정의 외부에서 component 의 props 와 state 를 추출함으로써 getDerivedStateFromProps() 와 다른 클래스의 함수 사이의 일부 코드를 재사용 할 수 있습니다.

이 방법은 원인에 관계없이 모든 렌더에서 발생됩니다. `UNSAFE_componentWillReceiveProps` 와는 대조됩니다. 이것은 오직 부모가 re-render 을 야기시키고, 로컬 setState 의 결과로 발생하지 않을때만 발생합니다.

nextProps.someValue 를 this.props.someValue 와 비교해보면,

둘 값이 다르면 몇 가지 작업(setSate)을 수행합니다.

```jsx
static getDerivedStateFromProps(nextProps, prevState){   if(nextProps.someValue!==prevState.someValue){     
   return { someState: nextProps.someValue};  
} else return null;}
```

이것은 `nextProps` 와 `prevState` 두가지 param 을 받습니다. 앞서 언급했듯이 이 함수 안에서는 접근 할 수 없습니다. nextProps 와 이전의 props 를 비교하기 위해서는 props 를 state 에 저장해야 합니다.

위의 코드에서 `nextProps` 와 `prevState` 를 합니다. 두 값이 다르다면 object 를 반환하여 state 를 업데이트 합니다.

그렇지 않으면 state 업데이트가 필요하지 않음을 나타내는 null 이 반환됩니다. 만약 state 가 변화한다면, `componentWillReceiveProps` 에서와 같이 원하는 작업을 수행할 수 있는 곳에서 `componentDidUpadate` 가 호출됩니다.
 
### Bonus: React Lifecycle events

![placeholder](../assets/res/react/lifecycleEvents.jpeg "Medium example image")


-----
### Reference
- <a href="https://medium.freecodecamp.org/why-react16-is-a-blessing-to-react-developers-31433bfc210a">Why React16 is a blessing to React developers</a>