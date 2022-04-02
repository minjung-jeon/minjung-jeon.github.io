---
layout: post
title: "[React] React 의 배열 list 렌더링"
date: '2022-03-09 10:00:00'
image: '/assets/res/react.png'
description: react 에서 list 렌더링 방법
category: 'React'
tags:
- react
- frontend
- jsx
author: minjnug
---

React 에서는 배열 타입의 데이터를 여러개의 컴포넌트나 태그로 Rendering 할 수 있다.

동적인 배열을 렌더링할 때는 자바스크립트의 [**map()**](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/map) 을 사용한다. map() 은 각 요소에 대하여 주어진 함수를 호출한 결과를 모아 새로운 배열을 반환하는 함수이다. React 에서는 이를 활용하여 일반 데이터 배열을 React Element 로 이루어진 배열로 변환해줄 수 있다.


### 1. List Component

첫 번째 방법으로 배열을 반복 실행하여 각 요소에 대하여 element 를 반환하고 배열의 결과를 저장한다. 그리고 그 저장한 배열을 DOM에 렌더링 한다.
```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li>{number}</li>
  );
  
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

### 2. Key

만약 1 예제의 코드를 실행하면 개발자도구에서 에러가 발생하는 것을 확인할 수 있을 것 이다.

> Warning: Each child in a list should have a unique "key" prop.

이는 List 의 각 항목에 key 를 넣어야 한다는 것을 의미한다. React 에서 `key` 는 Element List 를 만들 때, 반드시 포함해야하는 특수한 Attribute 이다. 그럼 1 예제의 코드에서 key 누락 에러를 해결해보자.

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  const listItems = numbers.map((number) =>
    <li key={number.toString()}>
      {number}
    </li>
  );
  return (
    <ul>{listItems}</ul>
  );
}

const numbers = [1, 2, 3, 4, 5];
ReactDOM.render(
  <NumberList numbers={numbers} />,
  document.getElementById('root')
);
```

Key 는 React 가 어떤 항목을 변경, 추가, 삭제 할지 식별하는 것을 돕는 값이다. 그러므로 key는 element에 안정적인 고유성을 부여해야한다. 

[Key 가 필요한 이유](https://ko.reactjs.org/docs/reconciliation.html#recursing-on-children)

대부분의 경우에는 데이터의 ID 를 key 로 사용하는데, ID 가 없다면 index를 key 로 사용하기도 한다.

```jsx
const todoItems = todos.map((todo, index) =>
  <li key={index}>
    {todo.text}
  </li>
);
```

그러나 항목의 순서가 바뀔 수 있는 경우 key 에 index를 사용하는 것은 권장하지 않는다. 이로 인해 성능이 저하되거나 state 와 관련된 문제가 발생할 수 있기 때문이다.
(참고: [index를 key로 사용할 경우의 부정적인 영향](https://robinpokorny.medium.com/index-as-a-key-is-an-anti-pattern-e0349aece318))

Key 의 가장 큰 특징으로 `unique(고유성)` 이 있는데, 이는 형제 사이에서만 고유한 값이어야 한다. (전체 범위에서는 고유할 필요가 없다)
이는 두 개의 다른 배열을 만들 때, 동일한 Key를 사용할 수 있음을 의미한다.

```jsx
function Blog(props) {
  const sidebar = (
    <ul>
      {props.posts.map((post) =>
        <li key={post.id}>
          {post.title}
        </li>
      )}
    </ul>
  );

  // sidebar 의 li 리스트 key와 동일한 key 값이다.
  const content = props.posts.map((post) =>
    <div key={post.id}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );

  return (
    <div>
      {sidebar}
      <hr />
      {content}
    </div>
  );
}

const posts = [
  {id: 1, title: 'Hello World', content: 'Welcome to learning React!'},
  {id: 2, title: 'Installation', content: 'You can install React from npm.'}
];
ReactDOM.render(
  <Blog posts={posts} />,
  document.getElementById('root')
);
```

### JSX에 map() 포함시키기

두 번째 방법으로는 중괄호를 활용하여 JSX 내에서 직접 map 을 인라인으로 처리하는 것이다.
첫 번째 예시에서는 **listItems** 변수를 선언하고 이를 JSX 에 포함시켰다. 이를 JSX 내의 map 포함시키는 방법으로 변환해보면 아래와 같다.

```jsx
function NumberList(props) {
  const numbers = props.numbers;
  return (
    <ul>
      {numbers.map((number) =>
        <ListItem key={number.toString()}
                  value={number} />
      )}
    </ul>
  );
}
```

위의 방식으로 한다면 코드가 더 깔끔해지지만, map() 함수가 중첩된다면 컴포넌트로 추출하는 것이 좋을 것이다. 
변수로 추출할지 인라인으로 처리할지에 대한 결정은 개발자의 몫이다.

-----
### Reference
- <a href="https://ko.reactjs.org/docs/lists-and-keys.html">리스트와 Key</a>