---
layout: post
title: "[Web] Canvas CORS Issue"
date: '2018-08-29 15:00:00'
image: '/assets/res/web.png'
description: Canvas CORS(cross-origin resource sharing) Issue
category: 'Web'
tags:
- javascript
- frontend
- web
- canvas
- cors
author: minjnug
---

### Canvas 를 사용하며 발생한 CORS 이슈

createjs 라이브러리를 사용하여 canvas 에 애니메이션을 만들어가던 중

**This is most likely due to security restrictions on reading canvas pixel data with local or cross-domain images.**

라는 createjs 내부에서 던지는 오류를 확인했다.
 
Canvas를 사용할 때 CORS 승인 없이 이미지를 사용할 수는 있지만, 이미지를 변형한 상태에서 데이터를 캔버스에서 꺼내려 한다면 **"canvas tainted"** 관련 오류가 발생할 것이다.

**MDN <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image">CORS enabled image</a> docs 의 "tainted canvas" 관련 글**

---
**What is a "tainted" canvas?**

Canvas 에서 CORS 승인 없이 이미지를 사용할 수 있지만, 그렇게 한다면 캔버스가 오염(taints)된다. 캔버스가 오염되면, 더이상 캔버스에서 데이터를 빼낼 수 없게된다. 
예를 들어, 더 이상 Canvas 에서 toBlob(), toDataURL(), getImageData() 함수를 사용할 수 없다. 사용한다면 보안 오류가 발생할 것이다.
이것은 원격 웹 사이트에서 권한 없이 정보를 가져오려는 이미지를 사용함으로써 사용자의 개인정보가 노출 되는 것을 방지한다.

---

이 문제를 해결하기 위해서는 서버에서 적절한 헤더(Access-Control-Allow-Origin : *)를 보내야 할 뿐만 아니라,
JavaScript 에서 이미지 자체에 Cross Origin 속성을 설정해야한다.

```js
var img = new Image();
img.src = "http://other-domain.com/image.jpg";
img.crossOrigin = "Anonymous";
```


### crossOrigin 속성 비지원 브라우저

MDN 의 <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes">CORS settings attributes</a> 에 crossOrigin 지원 범위는 Internet Explorer 11에서만 가능하기 때문에 IE10은 다른 방법을 사용해야만 한다.
XMLHttpRequest 객체의 Blob(멀티미디어 데이터를 객체로 다루기 위해 사용) 타입을 사용하면 쉽게 해결 할 수 있다.

```js
var xhr = new XMLHttpRequest();
xhr.open('GET', '/path/image.jpg', true);
xhr.responseType = 'blob';

xhr.onload = function(e) {
  if (this.status == 200) {
    var blob = this.response;
    
    var img = document.createElement('img');
    
    img.onload = function(e) {
      window.URL.revokeObjectURL(img.src); // Clean up after yourself.
    };
    
    img.src = window.URL.createObjectURL(blob);
    ...
  }
};

xhr.send();
```
<a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XMLHttpRequest MDN 문서</a>

Blob 객체나 FileReader 또한 IE 9 부터는 사용할 수 없기 때문에 그 이하의 브라우저에서는 binary 로 수신한 데이를 base64 로 직접 인코딩하여 이미지를 생성하는 방법으로 해결해야 할 것이다. 


---
### Reference
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image">CORS enabled image</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes">CORS settings attributes</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest">XMLHttpRequest</a>