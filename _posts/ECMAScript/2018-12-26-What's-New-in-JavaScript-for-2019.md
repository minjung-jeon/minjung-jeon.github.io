---
layout: post
title: "[ECMAScript] [번역] What's New in JavaScript for 2019"
date: '2018-12-26 15:00:00'
image: '/assets/res/js.jpeg'
description: JavaScript 2019
category: 'ECMAScript'
tags:
- javascript
- ECMAScript
- frontend
twitter_text: JavaScript 2019
introduction: JavaScript 2019
---

**<a href="https://developer.okta.com/blog/2019/01/22/whats-new-in-es2019/">What's New in JavaScript for 2019</a>**

### JavaScript 클래스에 대한 변경 사항

필드 선언, private 함수와 필드, static 함수와 필드를 포함한 Class에 대해 제안된 많은 변화가 있습니다. 여기에는 변화들이 어떻게 보일지에 대한 예가 있다.

```js
class Truck extends Automobile {
  model = "Heavy Duty"; // public field declaration
  #numberOfSeats = 5; // private field declaration
  #isCrewCab = true;
  static #name = "Truck"; // static private field declaration

  // static method
  static formattedName() {
    // Notice that the Truck class name is used
    // to access the static field instead of "this"
    return `This vehicle is a ${ Truck.#name }.`;
  }

  constructor( model, seats = 2 ) {
    super();
    this.seats = seats;
  }

  // Private method
  #getBodyType() {
    return this.#isCrewCab ? "Crew Cab" : "Standard Cab";
  }

  bodyType() {
    return `${ this.#numberOfSeats }-passenger ${ this.model } ${ this.#getBodyType() }`;
  }

  get seats() { return this.#numberOfSeats; }
  set seats( value ) {
    if ( value >= 1 && value < 7 ) {
      this.#numberOfSeats = value;
      this.#isCrewCab = value > 3;
    }
  }
}
```

### String trimStart() and trimEnd()

String 타입에는 문자열의 시작과 끝 모두에서 공백을 제거하는 `trim()` 함수가 있다. 추가된 `trimStart()`, `trimEnd()` 함수를 사용하면 고백 제거를 추가로 제어할 수 있다.

```js
const one = "      hello and let ";
const two = "us begin.        ";
console.log( one.trimStart() + two.trimEnd() ) // "hello and let us begin."
```

이 기능에 대한 흥미로운 사실은 이미 많은 javascript 엔진에서 구현되었다는 것이다. 이것은 브라우저들이 언어를 발전시키는데 도움을 주는 많은 케이스 중에 하나이다.


### Bigger Numbers with BigInt

우리는 현재 최대치인 2<sup>53</sup> 보다 큰 수를 표현할때 BigInt primitive를 볼 수 있다.
`BigInt`는 몇 가지 다른 방법들로 선언될 수 있다.

```js
// for reference
const theBiggestIntegerToday = Number.MAX_SAFE_INTEGER; // 9007199254740991

// use the 'n' syntax to declare a BigInt
const ABiggerInteger = 9100000000000001n;

// use the BigInt() constructor
const EvenBigger = BigInt( 9100000000000002 ); // 9100000000000002n

// use the BigInt() constructor with a string
const SuchBigWow = BigInt( "9100000000000003" ); // 9100000000000003n
```

[BigInt](https://developers.google.com/web/updates/2018/05/bigint) 에 대해 더 읽어보기.


### Flatten Arrays with flat() and flatMap()

함수형 프로그래밍을 공부한다면, `flat()` 과 `flatMap()`을 알아볼 수 있다. `flat()` 은 배열의 값을 가져오도록 설계되어 있습니다. 이 값 중 일부는 더 많은 배열 일 수 있으며, 새로운 1차원 배열을 반환합니다.


```js
const nestedArraysOhMy = [ "a", ["b", "c"], ["d", ["e", "f"]]];
// .flat() takes an optional depth argument
const ahhThatsBetter = nestedArraysOhMy.flat( 2 );
console.log( ahhThatsBetter ); // [ "a", "b", "c", "d", "e", "f" ]
```

`flatMap()`은 map()과 비슷하지만 콜백은 배열을 반환할 수 있으며, 최종 결과는 평면의 1차원 배열로 반환된다.

```js
const scattered = [ "my favorite", "hamburger", "is a", "chicken sandwich" ];

// regular map() results in nested arrays
const huh = scattered.map( chunk => chunk.split( " " ) );
console.log( huh ); // [ [ "my", "favorite" ], [ "hamburger" ], [ "is", "a" ], [ "chicken", "sandwich" ] ]

// flatMap() concatenates the returned arrays together
const better = scattered.flatMap( chunk => chunk.split( " " ) );
console.log( better ); // [ "my", "favorite", "hamburger", "is", "a", "chicken", "sandwich" ]
```



-----
### Reference
- <a href="https://developer.okta.com/blog/2019/01/22/whats-new-in-es2019/">What's New in JavaScript for 2019</a>
