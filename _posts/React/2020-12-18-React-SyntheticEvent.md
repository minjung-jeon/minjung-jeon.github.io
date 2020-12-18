---
layout: post
title: "[React] 합성 이벤트(SyntheticEvent) - CompositionEvent"
date: '2020-12-18 15:00:00'
image: '/assets/res/react.png'
description: 
category: 'React'
tags:
- react
- frontend
- CompositionEvent
- SyntheticEvent
author: minjnug
---

[keyCode 229 버그]('../../../Web/2020-12-15-IME-keyCode-229-issue.md)를 처리하며, React 에서도 composing 관련 이벤트를 조사하며 합성 이벤트에 대해 공부하게 되었다.

## React의 합성 이벤트(SyntheticEvent)

React에서는 엘리먼트가 처음 렌더링 될때 리스너를 제공하여 처리한다.

이때 이벤트 핸들러는 모든 브라우저에서 이벤트를 동일하게 처리하기 위한 이벤트 래퍼 `SyntheticEvent` 객체를 전달 받고, 대부분의 인터페이스는 브라우저 고유의 이벤트와 동일하다.

만약 브라우저 고유 이벤트를 알고 싶다면, 합성 이벤트 객체의 `nativeEvent` attribute를 사용하면 된다.

합성 이벤트에는 이미 많이 사용하고 있는, keyboardEvent, FocusEvent, MouseEvent 등 다양한 이벤트 들이 존재하는데, 그 중에 composing 시점과 관련된 [CompositionEvent](https://ko.reactjs.org/docs/events.html#composition-events)도 존재한다.


## CompositionEvent 종류 와 사용법

CompositionEvent의 내용은 브라우저 [CompositionEvent](https://developer.mozilla.org/en-US/docs/Web/API/CompositionEvent)와 동일하다.

```jsx
class CompositionEvent extends React.Component {
    state={
          textData: ''
    };

    onChange = (e) => {
      console.log('onChange: ' + e.target.value);
      this.setState({
      	[e.target.name]: e.target.value
      });
    };

    onKeyDown = (e) => {
      console.log('onKeyDown: ' + e.key);
    };

    onCompositionStart = (e) => {
        console.log('onCompositionStart: ' + e.data);
    };

    onCompositionUpdate = (e) => {
        console.log('onCompositionUpdate: ' + e.data);
    };

    onCompositionEnd = (e) => {
        console.log('onCompositionEnd: ' + e.data);
    };

    render() {
        return (
            <div>
                <h1>Event Practice</h1>   
                <input
                    type ="text"
                    name="textData"
                    placeholder="text input..."
                    value={this.state.textData}
                    onChange={this.onChange}
                    onKeyDown={this.onKeyDown}
                    onCompositionStart={this.onCompositionStart}
                    onCompositionUpdate={this.onCompositionUpdate}
                    onCompositionEnd={this.onCompositionEnd}
                />  
            </div>
        );
    }

}
```

위의 테스트 코드로 한글을 입력했을때 Composing 이 발생하는데, 이때 시점별로 각 이벤트가 발생한다.

![placeholder](../assets/res/react/compositionEvent_Test.png "Medium example image")

>onKeyDown -> onCompositionStart -> onCompositionUpdate -> onChange -> onCompositionEnd 

순서로 이벤트가 발생하며, Composing 시점을 이용하여, 필요한 제어를 할 수 있다.

-----
### Reference
- <a href="https://ko.reactjs.org/docs/events.html">React - 합성 이벤트(SyntheticEvent)</a>
- <a href="https://ko.reactjs.org/docs/handling-events.html">React - 이벤트 처리하기</a>