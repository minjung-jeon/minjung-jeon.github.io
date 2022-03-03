---
layout: post
title: "[React] React 의 조건부 렌더링"
date: '2022-03-02 10:00:00'
image: '/assets/res/react.png'
description: react 에서 조건부 렌더링 방법
category: 'React'
tags:
- react
- frontend
- jsx
author: minjnug
---

React 에서는 특정 조건에 따라 결과물을 다르게 렌더링 할 수 있다.

```jsx
function UserGreeting(props) {
  return <h1>Welcome back!</h1>;
}

function GuestGreeting(props) {
  return <h1>Please sign up.</h1>;
}
```

사용자의 로그인 여부에 따라 위의 UserGreeting, GuestGreeting 중 하나의 Component 를 노출해야하는 상황을 가정해보자.

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;
  if (isLoggedIn) {
    return <UserGreeting />;
  }
  return <GuestGreeting />;
}
```

위와 같이 사용자의 로그인 여부를 판단하는 **isLoggedIn** prop에 따라서 다른 인사말을 렌더링 한다.

변수를 선언하고 **if** 를 활용하여 조건부 렌더링을 하는 방법 이외에 여러 조건을 jsx 안에서 inline 으로 처리할 수 있는 방법이 있다. **(jsx 안에서는 if, if-else, for, while .. 등을 사용할 수 없음)**


### 논리연산자 && 로 if를 inline 으로 표현하기

jsx 안에서는 [중괄호를 활용하여 JavaScript 표현식](https://minjung-jeon.github.io/React-jsx/#jsx-%EB%82%B4%EC%97%90%EC%84%9C-javascript-%EC%BD%94%EB%93%9C-%EC%9E%91%EC%84%B1-%EB%B0%A9%EB%B2%95)을 넣을 수 있다는 특징을 활용하여 `&&`를 활용할 수 있다.


```jsx
function Mailbox(props) {
  const unreadMessages = props.unreadMessages;
  return (
    <div>
      {unreadMessages.length > 0 &&
        <h2>
          You have {unreadMessages.length} unread messages.
        </h2>
      }
    </div>
  );
}
```

> JavaScript 에서 true && expression은 항상 expression, `false && expression은 항상 false 가 된다.

따라서 && 뒤의 엘리먼트는 조건이 true일때 출력이 되고, 조건이 false라면 React는 무시하고 건너뛰게 된다.

### 조건부 연산자로 if-else구문 inline 으로 표현하기

삼항연산자 `condition ? true: false` 를 사용하여 짧은 구문으로 if-else 를 표현하는 방법도 있다.

초반의 예제와 같이 사용자의 로그인 여부에 따라 각각의 컴포넌트를 노출하는 구문을 삼항연산자를 활용하여 다음과 같이 처리할 수 있다.

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;

  return (
    <div>
    {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
    </div>;
  }
}
```

또한 아무것도 렌더링하고 싶지 않을 때는 null을 반환하면 된다.
(jsx 에서 null, false, undefined 를 렌더링하게 된다면 아무것도 나타나지 않게 된다는 점을 활용)

```jsx
function Greeting(props) {
  const isLoggedIn = props.isLoggedIn;

  return (
    <div>
    {isLoggedIn ? <UserGreeting /> : null}
    </div>;
  }
}
```

### switch case, enum 렌더링

여러 케이스를 렌더링을 할 때는 switch 를 활용하여 case 에 따라 다른 값을 return 하는 방식으로 사용한다.

```jsx
function Fruit(props) {
  const fruit = props.fruit;

  switch(fruit) {
    case 'oranges':
      return <Oranges />;
    case 'apples':
      return <Apples />;
    default: 
      return null;
  }
}
```

이를 간결하게 표현하고 싶을 때, 아래와 같이 enum 을 활용할 수 있다.

```jsx
const FruitType = {
  oranges: <Oranges />,
  apples: <Apples />
};

function Fruit(props) {
  const fruit = props.fruit;

  return (
    <>
      { FruitType[fruit] }
    </>
  )
}
```


-----
### Reference
- <a href="https://ko.reactjs.org/docs/conditional-rendering.html">조건부 렌더링</a>