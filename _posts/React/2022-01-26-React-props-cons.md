---
layout: post
title: "[React] React 개념 및 장단점"
date: '2022-01-26 15:00:00'
image: '/assets/res/react.png'
description: react를 사용하는 이유와 장점/단점
category: 'React'
tags:
- react
- frontend
- SPA
- VirtualDOM
- Components
author: minjnug
---

React 는 페이스북에서 개발한 라이브러리로, Virtual DOM 을 사용하여 동적인 웹 페이지를 보다 효율적으로 랜더링하고 유지보수 할 수 있도록 해준다.

[React 는 개발자들 40% 이상이 선택하여](https://insights.stackoverflow.com/survey/2021#most-popular-technologies-webframe-prof) 가장 많이 사용되는 라이브러리로 알려져있다. 그럼 왜 React 가 많은 인기를 누리고 있는지 React 에 대해 자세히 알아보고자 한다.


## React’s pros and cons

### pros 장점

#### Virtual DOM

브라우저 랜더링에서 DOM 에 변화가 있을 경우 브라우저 작동원리에 따라 랜더링 과정을 반복하게 된다. `Virtual DOM` 은 그 과정에서 브라우저의 연산이 많아져 발생하는 비효율성을 최소화하기 위해 탄생했다.

Virtual DOM 은 실제 DOM 의 가상 복사본으로 View에 변화가 생기면, 이전의 가상돔과 새로운 가상돔을 비교하여 변경된 내용만 DOM 에 적용한다. 

![placeholder](../assets/res/react/Virtual_DOM.png "Virtual DOM")

반복되는 랜더링 과정을 줄여줌으로써 성능을 향상 시키는 효과를 가져오게 된다. React 는 빠른 성능으로 높은 평가를 받았는데, DOM 대신 Virtual DOM을 직접적인 결과이다.

#### Reusable Components

React 는 `컴포넌트 기반의 아키텍처`를 가지고 있어, 개발자가 가능한 많은 코드를 재사용하도록 권장한다.
이러한 `재사용 가능한 컴포넌트`는 생산성과 유지 보수를 용이하게 하여 React 의 큰 이점 중 하나라고 할 수 있다.

만약 하나의 요소가 변화할때, 다른 많은 요소들이 변화하는 복잡한 로직을 작업할 경우 React 는 컴포넌트 재사용성으로 보완가능하도록 도와줄 수 있다.


#### One-Way Data Flow

일반적으로 프레임워크을은 양방향 데이터 흐름을 특징으로 하여, 변경이 발생할 때 마다 전체 어플리케이션도 변경되는 일이 생긴다. 그러나 React는 안정성을 보장하는 `단방향 데이터 흐름`이 특징이다.
(한 방향으로 데이터가 흐른다는 의미는 자식의 구성 요소가 부모의 구성 요소에 영향을 미칠 수 없다는 것을 의미한다.)

덕분에 특정 부분의 변경이 전체 앱의 구조에 영향을 미치지 않아 안정적이고, 쉬운 디버깅과 유지관리의 장점이 있다.


### cons 단점

#### Problems with SEO

React 는 SPA(Single Page Application) 로 웹 앱을 만들기 위한 라이브러리 이다. SPA 의 단점 중 하나는 SEO에 어려움이 있다는 것이다. 그리하여 React로 만든 웹 사이트는 non-SEO friendly sites 라고 불리기도 한다.

 React 는 하나의 HTML 파일이 있으며, 랜더링 되기 이전에는 빈 상태의 HTML만 있으므로 검색 엔진에 올라가기에 어려움이 있다. React 에서도 이 단점을 해결 할 수 있는 여러가지 방법이 존재하는데, `SSR(Server Side Rendering)`, `meta-tag`, `Pre-Rendering` 등이 있다. 


#### Etc.

 이 외에도 
 - IE8 이하는 지원이 안된다
 - SPA 의 단점으로 앱의 규모가 커지면 느려진다
 - View 만을 관리하여 그 이외의 데이터 모델링 등은 직접 구현하거나 라이브러리를 사용해야한다.




-----
### Reference
- <a href="https://massivepixel.io/blog/react-advantages-disadvantages">React JS: Advantages and Disadvantages</a>