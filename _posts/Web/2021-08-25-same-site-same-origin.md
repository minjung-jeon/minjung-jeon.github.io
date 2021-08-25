---
layout: post
title: "[Web][번역] 'same-site'와 'same-origin' 에 대한 이해"
date: '2021-08-25 15:00:00'
image: '/assets/res/web.png'
category: 'Web'
tags:
- javascript
- frontend
- web
- SOP
- same-origin-policy
- same-origin
- same-site
paginate: false
author: minjnug
---

**'same-site'** 와 **'same-origin'** 는 자주 인용되지만 종종 잘 못 이해되는 용어입니다. 예를 들어, 해당 용어들은 페이지 전환, fetch() 요청, 쿠키, 팝업 열기, 임베디드 리소스, iframe 관련하여 언급됩니다.

## Origin

> ex) https://www.exameple.com:443
> - https : **scheme** 
> - www.example.com : **host name**
> - 443 : **port** 

**Origin** 은 scheme(HTTP, HTTPS와 같은 프로토콜이라고도 함), host name, port(지정된 경우) 로 구성되어 있습니다. 

예를 들어, `https://www.example.com:443/foo` 의 URL이 있을 경우 origin은 `https://www.example.com:443`가 됩니다.

#### same-origin 과 cross-origin

동일한 scheme, host name, port 로 구성된 웹 사이트는 same-origin(동일 출처)으로 간주됩니다. 다른 모든 것들은 cross-origin(교차 출처)로 간주됩니다.

```
Origin A : https://www.example.com:443 (기준 URL)
```

|origin B|same-origin OR cross-origin|
|:---:|:---:|
|https://www.evil.com:443|cross-origin: domains 불일치|
|https://example.com:443|cross-origin: subdomains 불일치|
|https://login.example.com:443|cross-origin: subdomains 불일치|
|http://www.example.com:443|cross-origin: schemes 불일치|
|https://www.example.com:80|cross-origin: 포트 번호 불일치|
|https://www.example.com:443|same-origin: 정확한 일치|
|https://www.example.com|same-origin: 암시적 포트 번호(443) 일치|


## Site

`.com` 및 `.org`와 같은 최상위 도메인(TLDs)은 [Root Zone Database](https://www.iana.org/domains/root/db)에 나열됩니다. 위의 예에서 TLD와 그 바로 앞의 도메인 부분의 조합을 `Site`라 합니다. 예를 들어 `https://www.example.com:443/foo` URL의 경우 `Site`는 `example.com`입니다.

그러나 `.co.jp` 또는 `.github.io`와 같은 도메인의 경우 .jp 또는 .io의 TLD를 사용하는 것만으로는 "Site"를 식별할 수 있을 만큼 세분화되지 않습니다. 그리고 특정 TLD에 대해 등록 가능한 도메인의 레벨을 알고리즘적으로 결정할 방법이 없습니다. 이것이 `effective TLDs(eTLD)` 목록이 만들어진 이유입니다. 이들은 [Public Suffix List](https://wiki.mozilla.org/Public_Suffix_List#TLD_Lists)에 정의되어 있습니다. eTLDs 목록은 [publicsuffix.org/list](https://publicsuffix.org/list/)에서 관리됩니다.

전체 site 이름은 `eTLD+1` 로 알려져 있습니다. 예를 들어, URL이 `https://my-project.github.io` 인 경우 eTLD 는 `.github.io`이고 eTLD+1은 'Site' 로 간주되는 `my-project.github.io`입니다. 즉, `eTLD+1` 은 eTLD(effective TLD) 과 바로 앞의 도메인 부분입니다.

#### same-site 과 cross-site

동일한 eTLD+1 이 있는 웹사이트는 `same-site` 로 간주됩니다. 다른 eTLD+1 이 있는 웹사이트는 `cross-site` 입니다.

```
Origin A : https://www.example.com:443 (기준 URL)
```

|origin B|same-site OR cross-site|
|:---:|:---:|
|https://**www.evil.com**:443|cross-site: domains 불일치|
|https://**login**.example.com:443|same-site: 다른 subdomains 상관없음|
|**http**://www.example.com:443|same-site: 다른 schemes은 상관없음|
|https://www.example.com:**80**|same-site: 다른 포트 번호는 상관없음|
|**https://www.example.com:443**|same-site: 정확한 일치|
|**https://www.example.com**|same-site: 포트 번호 상관없음|


#### schemeful same-site

`same-site` 의 정의는 `HTTP` 가 weak channel(비보안 출처의 요청을 위조할 수 있는 네트워크 공격, 웹사이트 취약점 공격...)로 사용되는 것을 방지하기 위해 URL scheme 을 site의 일부로 간주하도록 진화하고 있습니다.

브라우저가 이 해석으로 이동함에 따라 이전 정의를 언급할 때와 더 엄격한 정의인 'schemeful same-site' 를 언급할 때, 'scheme-less same-site'에 대한 참조를 볼 수 있습니다. 이 경우 schemes 가 일치하지 않기 때문에 `http://www.example.com` 및 `https://www.example.com` 이 교차 사이트로 간주됩니다.

```
Origin A : https://www.example.com:443 (기준 URL)
```

|origin B|schemeful same-site|
|:---:|:---:|
|https://www.evil.com:443|cross-site: domains 불일치|
|https://**login**.example.com:443|schemeful same-site: 다른 subdomains 상관없음|
|**http**://www.example.com:443|cross-site: schemes 불일치|
|https://www.example.com:**80**|schemeful same-site: 다른 포트 번호는 상관없음|
|**https://www.example.com:443**|schemeful same-site: 정확한 일치|
|**https://www.example.com**|schemeful same-site: 포트 번호 상관없음|


#### 요청이 'same-site', 'same-origin', 'cross-site' 인지 확인하는 방법 

Chrome 은 `Sec-Fetch-Site` HTTP 헤더와 함께 요청을 보냅니다.(다른 브라우저는 `Sec-Fetch-Site` 를 지원하지 않을 수도 있습니다.) 이것은 더 큰 [Fetch Metadata Request Headers](https://www.w3.org/TR/fetch-metadata/) 목적의 일부입니다. 이 헤더(Sec-Fetch-Site)는 다음의 값들 중 하나를 가지고 있습니다.

- cross-site
- same-site
- same-origin
- none

`Sec-Fetch-Site` 의 값을 조사하여 요청이 'same-site', 'same-origin', 'cross-site' 인지를 확인 할 수 있습니다. ('schemeful-same-site' 는 `Sec-Fetch-Site`로 알 수 없음.)

-----
### Reference
- <a href="https://web.dev/same-site-same-origin/">Understanding "same-site" and "same-origin"</a>