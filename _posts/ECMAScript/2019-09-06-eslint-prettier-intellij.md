---
layout: post
title: "[ECMAScript] Eslint & Prettier(저장시 자동 reformat) Setting(IntelliJ)"
date: '2019-09-06 15:00:00'
image: '/assets/res/js.jpeg'
description: Eslint & Prettier(저장시 자동 reformat)
category: 'ECMAScript'
tags:
- javascript
- ECMAScript
- frontend
- eslint
- prettier
- IntelliJ
author: minjnug
---


## Eslint 설정

> npm install eslint eslint-plugin-react eslint-babel --save-dev

1. package.json 에 lint Script 추가

```js
"lint": "eslint pc/src/main/fe/**/*.jsx mobile/src/main/fe/**/*.jsx"
```

2. `.eslintrc.js` 파일 생성(Deprecated - use .eslintrc)

```js
module.exports = {
  extends: ['prettier'], // 확장하고 싶은 기본 규칙 추가 ex) ["eslint:recommended", "plugin:react/recommended"]
  // parser : JavaScript transpiler 및 ES 언어 features 을 조정할 수 있습니다.
  parser: 'babel-eslint', // bable-eslint : ESLint가 Babel에 의해 변환 된 소스 코드에서 실행될 수 있도록하는 파서입니다.
  env: {
    browser: true, // ex) document, setInterval, clearInterval
    node: true,
  },
  plugins: ['react', 'prettier'], //jsx, prettier 활성화
  rules: {
    // 0 false, 1 warn, 2 error
    'prettier/prettier': 0, //prettier 에 대한 경고 끄기
    'for-direction': 2, // for 루프가 무한대로 실행되는 것을 방지
    'no-undef': 2,
    'no-console': 2,
    'no-empty': 2,
    'no-dupe-args': 2,
    'no-dupe-keys': 2,
    'no-unreachable': 2,
    'react/jsx-key': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-uses-vars': 2,
    'react/no-children-prop': 2,
    'react/no-deprecated': 2, // react version 감지하여 deprecated 된 함수 경고
    'react/no-direct-mutation-state': 2, // state 를 직접 바꾸지 않게하기 위한 옵션
    'react/no-is-mounted': 2,
    'react/no-render-return-value': 2,
    'react/no-unknown-property': 2,
    'react/require-render-return': 2, //render method를 작성할때 return 이 없으면 경고
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  globals: {
    naver: 'readonly', // global 변수 naver 설정
  },
};

```

### 추천 규칙 URL
 - https://github.com/yannickcr/eslint-plugin-react
 - https://eslint.org/docs/rules/


<br/>

## Prettier 설정

1. 필요한 Dependencies 설치

    > npm install prettier --save-dev

2. Prettier 는 저장 시 자동 수정을 위해 Global로 설치

    > npm install -g prettier

3. `.prettierrc.js` 파일 생성 

```js
  // prettier 은 기본적으로 .editorconfig 파일을 고려합니다. .prettierrc.js 에서 editorconfig : true로 제어가능
module.exports = {
  tabWidth: 4,
  useTabs: true,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true, // JSX에서 singleQuote or doubleQuote
  endOfLine: 'lf',
  trailingComma: 'all', // comma 항상 붙이기
  bracketSpacing: false, // 객체리터럴에서 { } 사이에 공백을 넣을 것인지
  jsxBracketSameLine: false, // 여러줄의 JSX 요소가 있을때, > 를 마지막 줄의 끝부분에서 닫을 것인지
  arrowParens: 'always', // (x) => x : always | x => x : avoid
};
```
<br/>

### Prettier 저장 시 자동 reformat

1. IntelliJ 의  **Prettier** Plugins 설치
![image](../assets/res/ecma/prettier-plugin.png)


2. Languages & Frameworks > JavaScript > Libraries 에서 prettier libraries 설치
![image](../assets/res/ecma/prettier-libraries.png)


3. Languages & Frameworks > JavaScript > Prettier 의 **Prettier package** 경로를 **global Prettier**로 설정
![image](../assets/res/ecma/prettier-package.png)


4. Keymap 에서 `Reformat with Prettier` shortcut **command+s** 로 등록 (기존에 등록된 다른 command+s  shortcut은 삭제해야 동작함)
![image](../assets/res/ecma/prettier-keymap.png)

### Prettier 옵션 URL
- https://prettier.io/docs/en/options.html

<br/>

## Eslint & Prettier

> npm install eslint-config-prettier eslint-plugin-prettier --save-dev

#### eslint-config-prettier

Prettier 와 충돌하는 lint 규칙을 비활성화 하는 구성

.eslintrc 구성 내에서 확장 배열의 마지막에 놓아야 다른 구성을 무시할 수 있습니다. 

```js
{
 "extends": ['eslint:recommended', 'plugin:react/recommended', 'prettier' ],
}
```

#### eslint-plugin-prettier

Prettier 에서 인식하는 코드상의 포맷 오류를 EsLint 오류로 출력해줍니다.

(오류를 출력할 필요가 없을 경우에는 사용 하지 않아도 됨, 공식문서에서는 함께 사용하기를 권장)


-----
### Reference
- <a href="https://prettier.io/">Prettier</a>
- <a href="https://eslint.org/">Eslint</a>
