---
layout: post
title: "[React] React Component 간의 합성(Composition)"
date: '2022-03-30 10:00:00'
image: '/assets/res/react.png'
description: React Component 간의 합성(Composition)
category: 'React'
tags:
- react
- frontend
- jsx
- Composition
- Inheritance
author: minjnug
---

### 합성 vs 상속 

객체지향에서 코드를 재사용하기 위한 방법으로 사용하는 기법이 크게 `합성 과 상속`이 있다.

상속은 상위 클래스에 중복 로직을 구현해두고 이를 물려받아 코드를 재사용 하는 방법이다. `Is-a` 관계라고 불린다.

합성은 중복되는 로직들을 갖는 객체를 구현하고, 이를 주입받아 중복로직을 호출함으로써 퍼블릭 인터페이스를 재사용하는 방법이다. `Has-a` 관계 라고 불린다.

상속은 중복을 제거하기에 좋은 기술 처럼 보이지만, 상속이 갖는 단점은 치명적이기 때문에 재사용을 위한 기술로는 상속보다는 합성을 사용할 것을 권장한다.

### React 에서의 Component 합성

> React는 강력한 합성 모델을 가지고 있으며, 상속 대신 합성을 사용하여 컴포넌트 간에 코드를 재사용하는 것이 좋다.

React 에서 어떤 컴포넌트들은 어떤 자식 엘리먼트가 들어올 지 미리 예상할 수 없는 경우가 있다.

예를 들어 Sidebar 또는 Dialog 와 같은 Component 는 범용적인 역할을 하여 재사용 하는 경우가 대부분이다. 이때 내용을 어떻게 그려야 하는 지는 알수가 없다.

이때 `children` prop 을 사용하여 자식 Element 를 출력에 그대로 전달 할 수 있다.

```jsx
function FancyBorder(props) {
  return (
    <div className={'FancyBorder FancyBorder-' + props.color}>
      {props.children}
    </div>
  );
}
```

위와 같은 방식으로 다른 Component 에서 JSX 를  중첩하여 임의의 children 을 전달 할 수 있다.

```jsx
function WelcomeDialog() {
  return (
    <FancyBorder color="blue">
      <h1 className="Dialog-title">
        Welcome
      </h1>
      <p className="Dialog-message">
        Thank you for visiting our spacecraft!
      </p>
    </FancyBorder>
  );
}
```

`<FancyBorder>` JSX 태그 안에 있는 내용들이 FancyBorder Component 의 `props.children` 값으로 전달되어 출력된다.

그러나 위의 경우에는 props.children 으로 단 하나의 자식 Element 를 전달하지만, 종종 여러 개의 Element 들을 전달해야 할 경우가 있다.

이런 경우에는 children 대신에 고유한 방식을 적용할 수 있다.

```jsx
function SplitPane(props) {
  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        {props.left}
      </div>
      <div className="SplitPane-right">
        {props.right}
      </div>
    </div>
  );
}

function App() {
  return (
    <SplitPane
      left={
        <Contacts />
      }
      right={
        <Chat />
      } />
  );
}
```

`<Contacts />` 와 `<Chat />` React Element는 객체이기 때문에 다른 데이터들 처럼 prop 으로 전달 할 수 있다.


### 상속은?

Facebook 에서는 수천 개의 React Component 를 사용했지만, 상속 계층 구조로 작성을 권장할만한 사례는 아직 찾지 못했다고 한다.

props 와 합성은 명시적이고 안전한 방법으로 Component 의 모양과 동작을 커스터마이징 하는데 필요한 모든 유연성을 제공한다. 

UI 가 아닌 기능을 여러 Component 에서 재사용하기를 원한다면, 별도의 JavaScript 모듈로 분리하는 것이 좋다. 상속없이 Component 에서 해당 함수, 객체, 클래스 등을 import 하여 사용할 수 있다.

-----
### Reference
- <a href="https://ko.reactjs.org/docs/composition-vs-inheritance.html">합성 (Composition) vs 상속 (Inheritance)</a>
