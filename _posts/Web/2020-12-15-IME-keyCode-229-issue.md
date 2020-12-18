---
layout: post
title: "[Web] IME keyCode 229 Issue(Chrome+한글, Android Mobile 환경)"
date: '2020-12-15 15:00:00'
image: '/assets/res/web.png'
description: IME keyCode 229 Issue
category: 'Web'
tags:
- javascript
- frontend
- react
- web
- keyboardEvent
- InputEvent
paginate: false
author: minjnug
---


## input Tag, keyCode가 229가 나오는 이슈

**PC Chrome + 한글**

Chrome 브라우저에서 한글을 입력할때, 키 이벤트(keydown)의 keyCode 나 which 값을 출력해보면, 한글을 입력하는 동안에는 229 값으로 나오는 버그가 발생한다. 특정 환경에서 한글을 입력할때, IME 가 이를 처리하고한글 입력 중 에는 IME의 composing 단계를 거친다. 이때 keyEvents 를 처리시 composing 이 완료되지 않았기에 229 코드가 나타나는 것이다. 

(참고: KeyboardEvent 의 KeyboardEvent.keyCode, KeyboardEvent.charCode, KeyboardEvent.which 는 Deprecated 이므로 더 이상 권장되지 않는다.)

**Android Mobile**

Android Mobile 환경에서도 keyCode가 229로 나오는 비슷한 이슈가 발생하고 있다. 이와 관련하여 [Android developer 의 KeyEvent](https://developer.android.com/reference/android/view/KeyEvent) 관련 글에서는 키보드에서 키 입력시 Key Event가 생성된다는 보장이 없으며, 이는 IME(Input Method Editor) 의 재량에 맡겨져 있어 KeyEvents의 수신에 의존해서는 안된다고 설명되어 있다.

[bugs.chromium.org에 등록된 관련 이슈](https://bugs.chromium.org/p/chromium/issues/detail?id=118639)

**IME(Input Method Editor)**

> IME는 사용자 텍스트 입력의 helper application 입니다. 특정 Application 전, 후의 키 이벤트를 처리하고, composition 문자열을 생성하고, 사용자가 입력하려는 항목의 목록을 제안하고, 목록에서 선택한 항목으로 composition 문자열을 commit 하고, 어떤 변환도 없이 composition 문자열을 commit 합니다. IME는 중국어, 일본어, 한국어 등 키보드 자판 이외에 수천가지의 조합을 할 수 있는 경우에 사용합니다. 특히 오늘날 모바일 장치에서 IME는 자동 완성과 같은 라틴어 입력에도 사용됩니다.

<br/>

## keyboardEvent 테스트

Composition 되는 동안 keydown 이벤트의 keyCode 값은 229가 나타나고, composing 상태를 나타내는 isComposing 값은 false, keyup 이벤트의 isComposing 값은 true가 된다.
([Key Events During Composition-w3c](https://w3c.github.io/uievents/#events-composition-key-events))

***
<style>
    #testing {
        -webkit-border-radius: 15px;
        -moz-border-radius: 15px;
        border-radius: 15px;
        width: 200px;
        height: 30px;
        display: block;
        margin: 1.813rem 1.25rem;
    }
    input#testing:focus, input#testing:active {
        outline: #de513c auto 3px;
        -webkit-border-radius: 5px;
        -moz-border-radius: 5px;
        border-radius: 5px;
    }
</style>
<div id="test_area">
<input type="text" id="testing" name="testname">
<p style="display:inline-block">keydown keyCode: </p><p style="display:inline-block" id="keydown_keyCode"></p>
<div></div>
<p style="display:inline-block">keydown isComposing: </p><p style="display:inline-block" id="keydown_isComposing"></p>
<div></div>
<p style="display:inline-block">keyup keyCode: </p><p style="display:inline-block" id="keyup_keyCode"></p>
<div></div>
<p style="display:inline-block">keyup isComposing: </p><p style="display:inline-block" id="keyup_isComposing"></p>
</div>
<script>
document.getElementById('testing').onkeydown = function(event) {
    document.getElementById('keydown_keyCode').innerHTML = event.keyCode;
    document.getElementById('keydown_isComposing').innerHTML = event.isComposing;
}
document.getElementById('testing').onkeyup = function(event) {
    document.getElementById('keyup_keyCode').innerHTML = event.keyCode;
    document.getElementById('keyup_isComposing').innerHTML = event.isComposing;

}
</script>
***

- [**`event.isComposing`**](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/isComposing) 을 사용하여 Composing 상태인지 체크 가능
- 특정 키에 대한 정보를 얻고 싶다면, keyCode 대신 code(IE 비지원) 나 key 를 사용
  
```js
eventTarget.addEventListener("keydown", event => { 
  if (event.isComposing || event.keyCode === 229) { 
    return; 
  } 
  // 무언가를합니다 
});
```

<br/>

## KeyboardEvent 대신 InputEvent를 사용한 입력 체크

위의 이슈 처럼 KeyboardEvent의 수신에 의존한다면 다양한 버그(keyCode 229, 붙여넣기 했을 때의 감지)가 발생할 수 있기 때문에 입력 값에 대한 대응을 할때, KeyEvent 대신 **`Input event`** 를 사용할 것을 권장한다. 

`input` 이벤트는 `change` 이벤트와 달리 value 속성이 바뀔 때마다 반드시 발생한다. (ie9에서는 일부만 지원하므로 ie9 대응시에는 `change`이벤트 사용)

```js
eventTarget.addEventListener('input', event => {
    console.log(event.target.value);
});
```


-----
### Reference
- <a href="https://clark.engineering/input-on-android-229-unidentified-1d92105b9a04">Input on Android: 229 Unidentified</a>
- <a href="https://developer.mozilla.org/en-US/docs/Mozilla/IME_handling_guide#Native_IME_handlers">IME handling guide
</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/API/Document/keyup_event">Document: keyup event</a>
- <a href="https://developer.mozilla.org/ko/docs/Web/API/HTMLElement/input_event">HTMLElement: input event
</a>
- <a href="https://github.com/ianstormtaylor/slate/issues/2062">fix editing with "soft keyboards"</a>
