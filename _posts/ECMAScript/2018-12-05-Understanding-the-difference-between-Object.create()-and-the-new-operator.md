---
layout: post
title: "[ECMAScript] [번역] Object.create() 와 new 연사자의 차이 이해"
date: '2018-11-21 15:00:00'
image: '/assets/res/js.jpeg'
description: Object.create() 와 new 연사자
category: 'ECMAScript'
tags:
- javascript
- ECMAScript
- frontend
twitter_text: Object.create() 와 new 연사자
introduction: Object.create() 와 new 연사자
---

**원본글 : [Understanding the difference between Object.create() and the new operator]("https://medium.com/@jonathanvox01/understanding-the-difference-between-object-create-and-the-new-operator-b2a2f4749358")**

1. 최신 JavaScript 가 아닌 코드에서 실행할 수 있습니다.
2. 훌륭한 개발자가 되려면 모든 유형의 코드를 처리하는 방법을 배워야 합니다. 그것은 오래된 코드를 포함합니다.
3. ECMAScript6 에 소개된 클래스 키워드가 new 연산자를 활용합니다.

먼저 Object.create 가 수행하는 작업을 살펴보겠습니다.

```js
var dog = {
    eat: function() {
        console.log(this.eatFood)
    }
};

var maddie = Object.create(dog);
console.log(dog.isPrototypeOf(maddie)); //true
maddie.eatFood = 'NomNomNom';
maddie.eat(); //NomNomNom
```

위의 예시를 한 단계씩 살펴봅시다.

1. 'eat' 이라는 단일 메서드가 있는 'dog'라는 이름의 객체를 만듭니다.
2. Object.create(dog) 를 사용하여 'maddie'를 초기화합니다. 이 'dog'로 설정된 프로토타입으로 완전히 새로운 객체를 만듭니다.
3. 'dog'가 'maddie'의 prototype 인지 확인하기 위한 테스트를 합니다.
4. this.eatFood 를 통해 출력되도록 문자열을 설정합니다.
5. 새롭게 생성된 객체인 'maddie'를 사용하여 'eat' 함수를 호출합니다.
6. JavaScript 는 프로토타입 체인을 거쳐서 'dog' 에서 'eat' 함수를 찾아내고 이 키워드는 'maddie'로 설정됩니다.
7. 콘솔에 NomNomNom 이 출력됩니다.


Object.create() 는 프로토타입이 'dog' 로 설정된 완전히 새로운 객체 'maddie' 를 만들었습니다. 새로 만들어진 'maddie' 객체는 이제 dog 의 eat 함수에 접근이 가능합니다.

이제 new 연산자를 살펴봅시다.

```js
var Dog = function(){
    this.eatFood = 'NomNomNom';
    this.eat = function(){
        console.log(this.eatFood)
    }
};

var maddie = new(Dog);
console.log(maddie instanceof Dog); // True
maddie.eat(); //NomNomNom
```

이 함수에 new 연산자가 어떻게 적용되는지 그리고 어떻게 작동하는지 알아보겠습니다.

1. 'maddie'라는 새로운 객체를 생성합니다.
2. 'maddie'는 생성자 함수의 프로토타입을 상속합니다.
3. 1단계에서 만든 객체로 설정된 'this' 생성자를 실행합니다.
4. 생성된 객체 반환(생성자가 개체를 반환하지 않은 경우)

여러분은 아마도, Object.create() 와 new 연산자의 차이점이 무엇인지 생각하고 있을지도 모릅니다. 둘 다 같은 일을 하는 것같지만, 그들은 둘 다 새로운 객체를 만들고 프로토타입을 상속합니다.

이 예제가 혼란을 해소 할 수 있기를 바랍니다.


```js
function Dog(){
    this.pupper = 'Pupper';
};

Dog.prototype.pupperino = 'Pups.';
var maddie = new Dog();
var buddy = Object.create(Dog.prototype);

//Using Object.create()
console.log(buddy.pupper); //Output is undefined
console.log(buddy.pupperino); //Output is Pups.

//Using New Keyword
console.log(maddie.pupper); //Output is Pupper
console.log(maddie.pupperino); //Output is Pups.
```

이 예에서 주목해야 할 핵심 사항은 다음과 같습니다.

```js
console.log(buddy.pupper); //Output is undefined
```

buddy.pupper 의 출력을 확인해보면 정의되지 않았습니다. Object.create() 가 프로토타입을 Dog 로 설정하더라도 buddy는 생성자에서 this.pupper 에 접근할 수 없습니다.

이는 new Dog 가  실제로 생성자 코드를 실행하는 반면, Object.create 는 생성자 코드를 실행하지 않기 때문입니다.

Object.create()와 new 연산자가 어떻게 작동하는지, 그리고 이들이 서로 어떻게 다른지 좀 더 자세히 설명해 주었으면 합니다.




-----
### Reference
- <a href="https://medium.com/@jonathanvox01/understanding-the-difference-between-object-create-and-the-new-operator-b2a2f4749358">Understanding the difference between Object.create() and the new operator.</a>
