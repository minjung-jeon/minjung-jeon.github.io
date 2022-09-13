---
layout: post
title: "[React] useCallback 사용 이유 및 방법"
date: '2022-09-07 10:00:00'
image: '/assets/res/react.png'
description: useCallback 사용 이유 및 방법
category: 'React'
tags:
- react
- frontend
- jsx
- useCallback
- useMemo
author: minjnug
---

공식 문서에 정의된 내용에 의하면 `useCallback` 은 메모리제이션 된 콜백을 반환한다.
평소 자주 사용하는 useCallback 를 정확하게 왜 써야하는지에 대해서 알아보자.


<br/>


배열, 객체와 비슷하게 함수는 값이 아닌 참조로 비교 된다.

```jsx
const functionOne = function() {
  return 5;
};
const functionTwo = function() {
  return 5;
};
console.log(functionOne === functionTwo); // false
```

functionOne 과 functionTwo 의 함수는 동일하게 보이는 함수이지만 두 함수를 비교했을 경우 `false` 가 나오게 된다.

이처럼 Components 내에서 함수를 정의하게 된다면, 모든 단일 render 에서 매번 동일하지만 고유한 함수를 생성하게 될 것 이다.

매번 고유한 함수를 생성하게 된다면, 이 props 함수를 전달 받는 Component에서는 props 가 변경됐다고 판단하여 매번 리렌더링이 발생한다.

아래의 Count 예제를 살펴보자.

```jsx
// App.jsx
import Reset from './Reset';

function App() {
  const [count, setCount] = React.useState(0);

  function handleReset() {
    setCount(0);
  }

  return (
    <>
      Count: {count}
      <button
        onClick={() => {
          setCount(count + 1)
        }}
      >
        Click me!
      </button>
      <Reset handleClick={handleReset} />
    </>
  );
}

export default App;
```


```jsx
//Reset.jsx
function Reset({ handleClick }) {
  console.log('Render Reset');
  
  return (
    <button
      onClick={handleClick}
    >
      Reset Count!
    </button>
  );
}

export default React.memo(Reset);
```

Reset 컴포넌트는 `React.memo` 덕분에 Pure Component로 구성되어 있다. 
count에 의존되지 않는다고 생각 되지만 실제로는 count 가 변경될 때 마다 리렌더링 된다.

여기서 문제는 React.memo 의 기능을 뚫고 매번 고유한 `handleReset` 함수가 생성 된다. 
그렇기 때문에 props 가 변경됐다고 판단되어 매번 리렌더링이 발생한다.

이때 `useCallback` 을 사용하여 불필요한 리렌더링을 막을 수 있다.


```jsx
const handleReset = React.useCallback(() => {
  setCount(0);
}, []);
```

위의 코드로 처리한다면, 숫자가 변경될 때 마다 리렌더링은 더 이상 발생하지 않게 된다.

`useCallback` 은 두 개의 인자를 넘겨준다.

```jsx
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

첫 번째 인자로 함수를 전달하며, 해당 함수를 메모리제이션 하여 render 간에 전달한다.

두 번째 인자로는 의존성 값을 전달한다. 두 번째 인자로 넘겨준 의존성이 변경 되었을 경우만 리렌더링이 될 것 이다.
(위의 count 예제에서는 의존하는 값이 없기 때문에 빈 배열을 넘겨줬다.)






-----
### Referenxce
- <a href="https://ko.reactjs.org/docs/hooks-reference.html#usecallback">reactjs.org - useCallback</a>
- <a href="https://www.joshwcomeau.com/react/usememo-and-usecallback/">Understanding useMemo and useCallback</a>
