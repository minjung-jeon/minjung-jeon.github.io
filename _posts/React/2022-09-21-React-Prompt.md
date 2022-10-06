---
layout: post
title: "[React] react-router Prompt 커스터마이징, 페이지 이동 제어"
date: '2022-09-21 10:00:00'
image: '/assets/res/react.png'
description: Prompt 커스터마이징, 페이지 이동 제어
category: 'React'
tags:
- react
- frontend
- jsx
- prompt
- react-router
author: minjnug
---

Form 이 존재하는 페이지에서는 사용자가 실수로 페이지를 벗어날 경우를 대비하여 경고 Alert을 띄우는 경우가 많다. 

페이지가 닫히거나 다시 로드 되면 현재 문서와 리소스가 제거되는데, 그때 [beforeunload](https://developer.mozilla.org/ko/docs/Web/API/Window/beforeunload_event) 이벤트가 발생한다. 이 이벤트를 사용하여 사용자에게 페이지를 떠날 것인지 물어보는 개발 코드를 작성 할 수 있다.

React, React-router 를 사용하는 과정에서 beforeunload 이벤트가 정상적으로 발생하지 않았고, react-router-dom 에서 제공해주는 api인 `Prompt` 를 사용하여 문제를 해결했다.

react-router 에서는 페이지에서 벗어나기 전에 사용자에게 prompt를 표시하는데 사용하는 `<Prompt>` api 를 제공한다.


```jsx
<Prompt
  when={shouldConfirm}
  message="Are you sure you want to leave?"
/>
```
`when` 은 `boolean` 값으로 prompt 여부를 제어할 수 있다. 

`message` 인자는 `string` 과 `func` 형태로 작성이 가능하며, string 으로 작성 할 경우 사용자에게 표시할 메세지를 입력하면 된다.

```jsx
<Prompt
  message={(location, action) => {
    if (action === 'POP') {
      console.log("Backing up...")
    }

    return location.pathname.startsWith("/app")
      ? true
      : `Are you sure you want to go to ${location.pathname}?`
  }}
/>
```

message 를 func 형태로 작성할 경우 location, action 값이 전달된다.
사용자에게 Prompt 를 표시하고 싶다면 `String` 문자열을 반환하고, 페이지 전환을 허용하려면 `true` 를 반환하면 된다.





-----
### Referenxce
- <a href="https://v5.reactrouter.com/core/api/Prompt">React-router Prompt 공식문서</a>
