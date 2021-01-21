---
layout: post
title: "[ECMAScript] 실행 컨텍스트(Execution Context)"
date: '2021-01-20 15:00:00'
image: '/assets/res/js.jpeg'
description: 실행 컨텍스트(Execution Context)의 개념과 생성 과정
category: 'ECMAScript'
tags:
- javascript
- ECMAScript
- frontend
- execution context
author: minjnug
---

`실행 컨텍스트(Execution Context)`는 자바스크립트가 실행될 때 생성되는 하나의 실행 단위를 가리킨다. 자바스크립트는 타 언어에 비해 독특한 과정으로 실행 컨텍스트를 만들고 이 실행 컨텍스트는 자신만의 스코프를 갖는데, 이로 인해 Closure 와 같은 특별한 디자인 패턴을 구현할 수 있게 된다.

### 실행 컨텍스트(Execution Context)의 개념

ECMAScript 에서는 실행 컨텍스트(Execution Context)를 `실행 가능한 코드를 형성화하고 구분하는 추상적인 개념` 이라고 기술한다. 

실행 컨텍스트가 형성되는 경우를 세 가지로 규정을 하며, 

>1. 전역 코드(Global code)
>2. eval() 함수로 실행되는 코드(Eval code)
>3. 함수 안의 코드(Function code)

   
위의 3가지를 실행할 경우 이다.

실행 컨텍스트가 생성되고, 실행 컨텍스트는 Stack(한 쪽 끝에서만 자료를 넣거나 뺄 수 있는 선형 구조(Last In First Out)) 에 쌓이게 된다. 제일 위에 위치하는 실행 컨텍스트가 현재 실행되고 있는 컨텍스트가 된다.

```js
function foo() {
    console.log("This is foo");
}

function bar() {
    foo();
    console.log("This is bar");
}

bar();
```

위의 코드를 실행 컨텍스트 스택으로 표현을 한다면,

![image](../assets/res/ecma/execution-stack.jpg)

그림과 같은 과정으로 실행 컨텍스트 스택이 쌓이고 반환하게 된다.


### 실행 컨텍스트의 상태 구성

실행 컨텍스트는 `Lexical Environment, Variable Environment, This Binding` 총 3개의 부분으로 구성되어 있다.

#### Lexical Environment

해당 컨텍스트에서 선언된 변수나 함수들의 Reference 값을 저장한다. (코드에 의해 만들어진 Identifiers(식별자) 와 lexical nesting 구조에 의해 짜여진 관계를 정립해 주기 위해 사용된다.) Lexical Environment 에서는 environment record, outer(reference to the outer environment) 두 가지 요소를 갖고 있다.

environment record 는 최초의 변수, arguments, 함수 선언들을 저장하고, outer 에는 부모 Environment(reference) 를 저장한다.

실행 컨텍스트는 생성 될때, Lexical Environment 와 Variable Environment의 구성 요소는 동일한 값을 가지나, 컨텍스트 내에서 코드를 실행하는 동안 Variable Environment 와 달리 Lexical Environment의 구성 요소의 값은 변경 될 수 있다.

#### Variable Environment

Lexical Environment 에 포함되는 개념으로 Variable Object 에는 변수, 함수선언, 함수 매개 변수 들을 저장한다. 이는 코드에 의해 새로운 변수/함수가 추가되더라도 절대 값이 변하지 않는다.

#### This Binding

This Binding 객체는 해당 실행 컨텍스트의 this 키워드의 반환 값을 저장한다. this의 키워드는 현재 컨텍스트가 참조하고 있는 객체를 가리키며, 함수 호출 패턴에 의해 결정된다.


실행 컨텍스트 내부의 모든 코드가 실행 된 이후에는 Stack에서 삭제되며, 이와 관련된 Lexical Environment, Variable Environment, This Binding 세 가지 요소 들 또한 삭제된다.


### 실행 컨텍스트 생성 및 실행 과정

다음의 코드를 실행하면 실행 컨텍스트가 어떤 과정으로 생성되고 실행될지 알아보자.

```js
function foo(param1, param2){
    var a = 1;
    var b = 2;
    function bar() {
        return a + b;
    }
    return param1 + param2 + bar();
}

foo(3, 4);
```

#### 활성 객체 생성

실행 컨텍스트가 생성되면 자바스크립트 엔진은 매개 변수, arguments, 내부 함수 등이 저장되는 활성 객체를 생성한다. 이는 엔진 내부에서 새롭게 만들어진 컨텍스트로 접근 가능하지만, 사용자가 직접 접근 할 수 없다.

#### arguments 객체 생성

활성 객체 생성 이후 arguments 객체를 생성하는데, 활성 객체는 argumnets property 로 arguments 객체를 참조한다.

>argumnets는 함수를 호출할 때 넘긴 인자들의 정보가 배열의 형태로 저장된 객체를 의미한다. (배열의 형태는 실제 배열이 아닌 `유사 배열 객체`이다.)

위의 코드에서 foo() 함수에 인자들이 들어왔을 경우 활성 객체 내부에는 param1, param2 가 담긴 arguments가 추가된다.

![image](../assets/res/ecma/execution-arguments.png)


#### 스코프 정보 생성

다음으로 현재 컨텍스트의 함수 객체가 실행되는 환경(유효 범위)를 나타내는 스코프 정보를 생성한다. 이 정보는 연결 리스트와 유사한 형식으로 만들어진다. 

이 리스트를 스코트 체인이라고 하며, `[[Scopes]]` 프로퍼티로 참조된다. 이 리스트를 사용하여 현재 함수의 인자나 지역 변수 등에 접근할 수 있으며, 뿐만 아니라 상위 실행 컨텍스트의 변수도 접근이 가능하다.

![image](../assets/res/ecma/execution-scopes.png)

#### 변수와 함수 생성

현재 실행 컨텍스트 내부에서 사용되는 지역 변수는 각각의 프로퍼티와 값이 할당되며, 활성 객체(변수 객체) 안에 생성된다. (만약 값이 없다면 `undefined` 가 할당된다.)

이 과정에서 변수나 내부 함수는 생성만 되며, 초기화는 각 표현식이 실행되기 전까지 이루어지지 않는다. 그러므로 위의 코드에서 변수 a, b에는 각각 undefined 가 할당된다.
해당 변수에 대한 초기화는 변수 객체 생성이 다 이루어 진 후에 실행된다.

![image](../assets/res/ecma/execution-variable.png)


#### this 바인딩

변수와 함수 생성이 끝나면 this 값이 할당된다. (만약 this가 참조하는 객체가 없다면 전역 객체를 참조한다.) this에 할당되는 값은 함수 호출 패턴에 의해 결정된다. 내부 함수의 경우에는 this는 전역 객체가 된다.

![image](../assets/res/ecma/execution-this.png)

#### foo 함수 코드 실행

이러한 과정으로 하나의 실행 컨텍스트가 생성된 후에 코드에 있는 다른 표현식이 실행된다. 그 과정에서 변수 생성때 undefined 로 생성됐던 변수들은 초기화 및 연산이 이루어진다.

각 a 와 b 에 1, 2 가 할당되고, 함수 bar 가 실행되기 시작하면, foo 함수의 실행 컨텍스트와 동일하게 순차적으로 새로운 실행 컨텍스트가 생성된다.

결국 예제 코드의 foo(3, 4); 결과 값은 10이 된다.


-----
### Reference
- <a href="http://dmitrysoshnikov.com/ecmascript/chapter-1-execution-contexts/#global-code" target="_blank">ECMA-262-3 Execution Contexts</a>
- <a href="https://262.ecma-international.org/5.1/#sec-10.3" target="_blank">ECMA International ECAM-262</a>
- <a href="https://book.naver.com/bookdb/book_detail.nhn?bid=7400243" target="_blank">인사이드 자바스크립트(도서)</a>
