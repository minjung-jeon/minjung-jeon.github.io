---
layout: post
title: "[ECMAScript] AMD, CommonJS 의 JavaScript 모듈화"
date: '2018-10-24 15:00:00'
image: '/assets/res/js.jpeg'
description: AMD, CommonJS
category: 'ECMAScript'
tags:
- javascript
- ECMAScript
- frontend
- AMD
- CommonJS
author: minjnug
---

자바스크립트는 `모듈 사용의 표준이 존재하지 않는다` 는 다른 스크립트 언어 계열과 차이점이 존재합니다.

웹 사이트의 규모가 커질수록 소스를 관리하고 배포하는 비용이 커지고 있으며, 오래된 소스의 의존성 파악이 어려워지고 있습니다.
JavaScript 가 브라우저용 언어를 넘어 범용적으로 쓰이려면, 이러한 문제점을 해결해야하며, 이는 결국 모듈화로 귀결됩니다. 
 
JavaScript 의 모듈화 라이브러리 선두 주자인 CommonJS와 AMD 에 대하여 간략하게 알아보겠습니다.

(이 글은 <a href="https://d2.naver.com/helloworld/12864">JavaScript 표준을 위한 움직임: CommonJS와 AMD</a> 를 공부하며 작성했습니다.)

<br/>

## CommonJS

CommonJS 는 특유의 동기적인 특성으로 브라우저에서 뿐만 아니라 서버 사이드 개발에서도 사용하기 용이하도록 만들어졌다.
그렇기 때문에 CommonJS 는 보통 서버 사이드 개발에 좀 더 적합하며, AMD 는 비동기적인 특성으로 클라이언트 사이드 개발에 적합한 편이다. 

CommonJS 의 주요 명세는 이 모듈을 어떻게 정의하고, 사용할 것인가에 대한 것이다.

모듈화는 크게 `스코프, 정의, 사용` 세 부분으로 이루어진다.

- 스코프(Scope) : 자신만의 독립적인 실행 영역
- 정의 : exports 객체
- 사용 : require 함수

모듈은 자신만의 독립적인 실행 영역이 있어야하므로 전역변수와 지역변수를 분리하는 것이 중요하다.
서버 사이드에서는 파일 스코프가 있어 파일 하나에 하나의 모듈을 작성한다면, 전역 변수가 겹치지 않는다.

두 모듈(파일)을 공유하고자 한다면 exports 라는 전역 객체를 사용하고, 공유된 함수를 다른 모듈에서 사용할때는 require() 함수를 사용한다.
이러한 방식은 브라우저에서 큰 단점이 된다. 필요한 모듈을 모두 불러올때까지 아무것도 할 수 없게된다.
그렇기 때문에 동적 script 태그를 삽입하는 방식을 사용하게 된다.

<br/>

### 비동기 모듈 로드 문제

브라우저에서는 파일 단위의 스코프가 없다. 또한 script 태그를 사용하여 파일을 차례대로 로드한다면, 전역 변수가 겹치는 문제도 발생한다.
이러한 문제점을 해결하기 위하여 CommonJS 는 서버 모듈을 비동기적으로 클라이언트에 전송할 수 있는 `모듈 전송 포맷`을 추가로 정의했다.
서버사이드에서 사용하는 모듈을 브라우저에서 사용하는 모듈과 같이 전송 포맷으로 감싼다면 서버 모듈을 비동기적으로 로드할 수 있게 된다.

> 서버사이드에서 사용하는 모듈

```js
// complex-numbers/plus-two.js

var sum = require("./math").sum;  
exports.plusTwo = function(a){  
return sum(a, 2);  
};
```

> 브라우저에서 사용하는 모듈

```js
// complex-numbers/plus-two.js

// require.define() 함수를 통해(함수 클로저) 전역변수를 통제하고 있다. 
require.define({"complex-numbers/plus-two": function(require, exports){

//콜백 함수 안에 모듈을 정의한다.
var sum = require("./complex-number").sum;  
exports.plusTwo = function(a){  
return sum(a, 2);  
};
},["complex-numbers/math"]);
//먼저 로드되어야 할 모듈을 기술한다.
```

<br/>
<br/>

## AMD(Asynchronous Module Definition)

CommonJS 이외에도 비동기적 모듈 선언을 뜻하는 AMD라는 그룹이 존재한다.
AMD는 `비동기 모듈`(필요한 파일을 네트워크를 통해 내려받는 경우)에 대한 표준안을 다루고 있다.

<br/>

### AMD 의 특징

> AMD의 특징으로는 동적 로딩, 의존성 관리, 모듈화가 있다.

- **동적 로딩**

script 태그는 요청과 다운로드, 파싱, 실행이 일어나는 동안 브라우저는 다른 동작을 하지 않는다.
이러한 문제점의 해결방법 중 한가지로 script 태그의 동적 삽입이 있다.
동적 로딩(Dynamic Loading, 혹은 Lazy Loading)은 페이지 렌더링을 방해하지 않으면서 필요한 파일을 로딩할 수 있다.
이는 콜백 함수를 이용하여 로딩 완료 이벤트 처리가 가능하지만, 파일이 여러개이고 순서가 중요하다면 콜백 지옥에 빠질 수 있다.
AMD 의 점진적인 방식의 동적 로딩으로 보다 최적화 할 수 있다. 

- **의존성 관리**

JavaScript 는 언어 차원에서 명시적이고 강제적인 키워드가 존재하기 않기 때문에 스크립트 간의 의존성을 파악하기가 힘들다.
특정 기능의 스크립트(객체)가 이름을 붙일 수 있는 하나의 단위로 묶이고, 다른 객체에서 묶인 객체를 호출할 방법이 있다면 의존성은 관리가 된다.

- **모듈화**

스크립트 내부에서만 사용하는 변수, 함수들은 전역 공간에 둔다면 충돌이 발생할 수 있다.
스크립트의 모듈화는 이런 문제를 방지한다.

<br/>

### define() 함수

CommonJS 와 같이 exports 객체로 모듈을 정의하며, require() 함수를 사용하여 모듈을 사용한다.

AMD 만의 특징은 `define()` 함수이다. 브라우저 환경의 JavaScript 는 파일 스코프가 존재하지 않기 때문에 define() 함수로 파일 스코프를 대신한다.(네임스페이스 역할)

define() 함수는 전역함수로 모듈로더를 통해 실행시켜야하며, `define(id?, dependencies?, factory);` 와 같이 정의한다.

- id : id는 모듈을 식별하는데 사용하는 인수로, 선택적으로 사용한다. id가 없으면 로더가 요청하는 script 태그의 src 값을 기본 id로 설정한다.
- dependencies : 정의하려는 모듈의 의존성을 나타내는 배열로, 먼저 로드되어야 하는 모듈
    - 먼저 로드된 모듈은 세 번째 인수인 팩토리 함수로 넘겨진다.
    - 선택적 인수로 생략한다면 ['require', 'exports', 'module'] 이라는 이름이 기본으로 지정된다.
- factory : 모듈이나 객체를 인스턴스화하는 실제 구현을 담당
    - 팩토리 인수가 함수라면 싱글톤으로 한 번만 실행되고 반환되는 값이 있다면, 그 값을 exports 객체의 속성값으로 할당.
    - 팩토리 인수가 객체라면 exports 객체의 속성값으로 할당.


AMD 모듈 명세의 장점은 `브라우저/서버사이드 에서 동일한 코드로 동작`한다는 점이다.
define() 함수를 통해 전역변수 문제를 해결하며, 모듈을 필요한 시점에 로드하는 `Lazy-Loading` 기법을 응용할 수도 있다.

다음 예제는 3 가지 인수를 모두 사용하는 기본 AMD 모듈로, alpha 라는 모듈을 정의할 때 beta 라는 모듈이 필요한 상황이다.

```js
define("alpha", ["require", "exports", "beta"], function (require, exports, beta) {  
exports.verb = function() {

// 넘겨받는 인수를 사용해도 되고
return beta.verb();

// 또는 require()를 이용해
// 얻어 온 모듈을 사용해도 된다.
return require("beta").verb();  
}
});
```

<br/>
<br/>

## CommonJS 와 AMD 의 코드 비교

> CommonJS

```js
// package/lib is a dependency we require
var lib = require( "package/lib" );

// behavior for our module
function foo(){
    lib.log( "hello world!" );
}

// export (expose) foo to other modules as foobar
exports.foobar = foo;
```

> AMD

```js
// package/lib is a dependency we require
define(["package/lib"], function (lib) {

    // behavior for our module
    function foo() {
        lib.log( "hello world!" );
    }

    // export (expose) foo to other modules as foobar
    return {
        foobar: foo
    }
});
```


-----
### Reference
- <a href="https://d2.naver.com/helloworld/12864">JavaScript 표준을 위한 움직임: CommonJS와 AMD</a>
- <a href="https://programmingsummaries.tistory.com/321">JavaScript 모듈의 양대 산맥, CommonJS 와 AMD</a>