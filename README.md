[![RxR - ReactiveX & React](https://raw.githubusercontent.com/dacz/rxr/master/logo/rxr-logo-color-100x52.png)][e76967bf]

  [e76967bf]: https://dacz.github.io/rxr/ "RxR - ReactiveX & React"

# RxR - ReactiveX & React

[![Build Status](https://travis-ci.org/dacz/rxr.svg?branch=master)](https://travis-ci.org/dacz/rxr)
[![npm](https://img.shields.io/npm/v/rxr.svg?maxAge=1000)](https://www.npmjs.com/package/rxr)

RxR uses [RxJS](https://github.com/ReactiveX/rxjs) to introduce similar approach to write apps like Redux. It uses idea of messages pushed to streams (like Redux actions) and you get stream of current state objects. You do not need store, dispatch and you can use the whole power of RxJS library.

**Rewrite current react-redux app with RxR is usually straightforward.**

**RxJS is great. Try it.**

RxR is a really tiny layer, mostly helpers. You don't need to use RxR or learn RxR specific syntax (except RxJS but this is what we wanted). This is what I like on Redux a lot and this is what I wanted to have in RxR.

This is work in progress. Two packages ([rxr](https://github.com/dacz/rxr) and [rxr-react](https://github.com/dacz/rxr-react)).

Read more on [RxR docs](http://dacz.github.io/rxr).

**Here is demo app written in redux and then RxR.**: [rxr-redux-example](https://github.com/dacz/rxr-redux-example).

## Install

```
npm install --save rxr rxr-react
```
