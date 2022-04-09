---
layout: post
title: "[React] React Context API"
date: '2022-04-06 10:00:00'
image: '/assets/res/react.png'
description: React Context API 사용법 및 예제
category: 'React'
tags:
- react
- frontend
- jsx
- Context
- useContext
author: minjnug
---

일반적으로 React 에서 데이터는 부모로부터 자식에게 props를 통해 전달된다. 그러나 개발 중 어플리케이션 안에서 여러 Component 들에 데이터를 전달해야 할 경우 이 과정이 복잡하고 비효율적일 수 있다. 이와 같은 문제를 해결하기 위해 React 에서 `Context API` 를 제공하게 되었다.

Context 를 사용하면 단계마다 props 를 넘겨주지 않고도 Component 전체에 데이터를 제공할 수 있다. 즉, Context 는 Component 트리 안에서 전역적(global)이라고 볼 수 있는 데이터를 공유할 수 있도록 고안된 방법이다. 주로 Context 가 필요한 데이터로는 현재 로그인한 유저정보, 테마, 언어 정보 등이 있을 수 있다.

Context 의 주된 용도는 다양한 레벨의 Component 에게 데이터를 전달하는 것이다. context 를 사용하면 컴포넌트 재사용이 어려워 질 수 있기 때문에 꼭 필요할때만 사용하는 것이 좋다.

### Context API 사용법

#### React.createContext

> const MyContext = React.createContext(defaultValue);

Context 객체를 만들기 위해 `createContext` 라는 함수를 사용한다. createContext 함수의 인자로 해당 Context 에 default 로 저장할 값을 넘긴다.

Context 객체를 구독하고 있는 Component 를 렌더링할 때, React 는 **트리 상위에서 가장 가까이 있는 Provider** 로 부터 현재 값을 읽는다.

`defaultValue` 매개변수는 Component 트리 안에서 적절한 Provider 를 찾지 못했을 경우에만 쓰이는 값이다.
(**Provider 를 통해 undefined 값을 보내도 구독 Component 들이 defaultValue 를 사용하지는 않는다.**)

#### React.Provider

> <MyContext.Provider value={/* 어떤 값 */}>

Provider 는 context 를 구독하는 Component 들에게 context 의 변화를 알리는 역할을 한다.

Provider Component 는 `value` prop 을 하위의 Component 들에게 전달하고, 전달 받을 수 있는 Component 의 수에 제한이 없다. Provider 하위에 다른 Provider를 배치하는 것도 가능하고, 이때 하위의 Provider 값이 우선시된다.

Provider 하위에서 context를 구독하는 component 는 Provider 의 value prop이 바뀔 때마다 다시 re-rendering 된다.

이제 생성하고, 저장한 Context 에 접근할 수 있는 3가지 방법을 알아보자.

#### Class.contextType

먼저 React.createContext() 로 생성한 Context 객체를 원하는 클래스의 contextType property로 지정할 수 있다. contextType 를 활용하면, 클래스 안에서 `this.context` 를 사용하여 해당 Context 의 가장 가까운 Provider 를 찾아 그 값을 읽을 수 있게 된다.

```jsx
import React, { Component } from "react";
import MyContext from "./MyContext";

class ClassComponentTest extends Component {
  static contextType = MyContext;

  componentDidMount() {
    console.log(this.context);
  }

  render() {
    let value = this.context;
    /* context 값을 이용한 렌더링 */
  }
}
```

contextType 는 **Class Component 에서만 사용**이 가능하다. 또한 contextType 을 사용하면 하나의 context 만 구독 할 수 있기 때문에 여러 context 를 구독하기 위해서는 `Consumer` 를 사용해야한다.

#### Context.Consumer

Context 에 접근하는 두 번째 방법으로는 Consumer 가 있다. `Consumer` 는 context 변화를 구독하는 React Component 이다. Consumer 를 사용하면 함수형 Component 안에서 context 를 구독할 수 있다.

```jsx
<MyContext.Consumer>
  {value => /* context 값을 이용한 렌더링 */}
</MyContext.Consumer>
```

Context.Consumer 의 자식은 **함수(Component)** 이어야 한다. 이때 이 함수는 context 의 현재 값을 받고 React 노드를 반환한다. 함수가 받는 value 매개변수 값은 해당 context 의 Provider 중 상위 트리에서 가장 가까운 Provider 의 value prop 과 동일하다.
(상위에 Provider가 없다면 value 매개변수 값은 createContext()에 보냈던 **defaultValue**와 동일할 것 이다.)

#### useContext()

> const value = useContext(MyContext);

React Hooks 에서 추가된 `useContext` 를 사용해서 context 에 접근할 수 있다. useContext 를 사용하여 context 객체를 받아 그 context 의 현재 값을 반환한다. 이 방법은 함수형 Component 에서만 사용 가능하다.


### 예제

이제 Context API 를 사용하여 theme 값이 변하는 어플리케이션을 만들어보자.

먼저 theme 에 대한 정보를 담고 있는 전역 Context 객체를 생성한다.

##### ThemeContext.jsx

```jsx
export const themes = {
  light: {
    foreground: '#000000',
    background: '#eeeeee',
  },
  dark: {
    foreground: '#ffffff',
    background: '#222222',
  },
};

export const ThemeContext = React.createContext(
  themes.dark // 기본값
);
```

이때 dark 객체를 defaultValue 로 지정한다.



##### ThemedButton.jsx

context 를 접근하여 사용할 ThemedButton Component 를 먼저 생성해보자.

첫 번재로 contextType 방식으로 Context 에 접근을 한다면 아래와 같다.

```jsx
import {ThemeContext} from './ThemeContext';

class ThemedButton extends React.Component {
  static contextType = ThemeContext;
  
  render() {
    let theme = this.context;
    return (
      <button
        style={{backgroundColor: theme.background}}
      />
    );
  }
}
```

두 번째로 Consumer 방식으로 Context 에 접근을 한다면 아래와 같다.
```jsx
import {ThemeContext} from './ThemeContext';

function ThemedButton() {
  return (
    <ThemeContext.Consumer>
      {theme => (
        <button
          style={{backgroundColor: theme.background}}
        />
      )}
    </ThemeContext.Consumer>
  );
  
}
```

세 번째로 useContext 함수를 사용하여 Context 에 접근한다면 조금 더 깔끔한 코드가 될 수 있다.
```jsx
import React, { useContext } from "react";
import ThemeContext from "./ThemeContext";

function ThemedButton() {
  const theme = useContext(ThemeContext);
  return (<button style={{backgroundColor: theme.background}} />);
}
```


##### app.jsx

이제 Provider 로 하위 Compoent(ThemedButton) 을 감싸주어 Context 에 접근 가능하도록 설정한다.

```jsx
import {ThemeContext, themes} from './ThemeContext';
import ThemedButton from './ThemedButton';

// ThemedButton를 사용하는 중간에 있는 컴포넌트
function Toolbar(props) {
  return (
    <ThemedButton onClick={props.changeTheme}>
      Change Theme
    </ThemedButton>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes.light,
    };

  render() {
    return (
      <Page>
        <ThemeContext.Provider value={this.state.theme}>
          <Toolbar changeTheme={this.toggleTheme} />
        </ThemeContext.Provider>
        <Section>
          <ThemedButton />
        </Section>
      </Page>
    );
  }
}
```

Provider 로 Toolbar 를 감싸주었으므로, Toolbar Component 에서는 value 로 가진 state theme 값을 읽는다. 그러나 그 밖의 Section 안에 있는 ThemedButton 에서는 defaultValue로 설정했던 dark 를 사용하게 된다. 

또한 Provider 하위 Component Toolbar 는 state 가 변화할 때 마다 re-rendering 하게 된다.


### 하위 Component 에서 Context 업데이트 하기

Component 하위 에서 context 를 업데이트 해야할 경우에는 context 를 통해 함수를 보내면 된다.

```jsx
export const ThemeContext = React.createContext({
  theme: themes.dark,
  toggleTheme: () => {},
});
```

```jsx
import {ThemeContext} from './ThemeContext';

function ThemeTogglerButton() {
  // ThemeTogglerButton는 context로부터
  // theme 값과 함께 toggleTheme 매서드도 받고 있습니다.
  return (
    <ThemeContext.Consumer>
      {({theme, toggleTheme}) => (
        <button
          onClick={toggleTheme}
          style={{backgroundColor: theme.background}}>
          Toggle Theme
        </button>
      )}
    </ThemeContext.Consumer>
  );
}

export default ThemeTogglerButton;
```

```jsx
import {ThemeContext, themes} from './ThemeContext';
import ThemeTogglerButton from './ThemeTogglerButton';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };

    // state에 업데이트 메서드도 포함되어있으므로
    // 이 또한 context Provider를 통해 전달될것입니다.
    this.state = {
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    };
  }

  render() {
    return (
      <ThemeContext.Provider value={this.state}>
        <Content />
      </ThemeContext.Provider>
    );
  }
}

function Content() {
  return (
    <div>
      <ThemeTogglerButton />
    </div>
  );
}
```

-----
### Reference
- <a href="https://ko.reactjs.org/docs/context.html">reactjs.org - Context</a>
- <a href="https://ko.reactjs.org/docs/hooks-reference.html#usecontext">reactjs.org - useContext</a>
