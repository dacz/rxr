# Introduction

RxR is based on [Redux](https://github.com/reactjs/redux) principles and implements them with [RxJS](https://github.com/ReactiveX/rxjs). Dan Abramov wrote nice **[intro why Redux](http://redux.js.org/docs/introduction/Motivation.html)**. It's valid for RxR - I recommend to read it... except the last paragraph - it's Redux specific :)

There is a lot of materials why [ReactiveX](http://reactivex.io/) is great and why you should learn about it. You may not like it or you may not use it but it enriches you as a programmer. Observable is intended to be part of next ES(7).

RxR uses [RxJS v5](https://github.com/ReactiveX/rxjs). There is similar library with version 4 and they slightly differ. I run a lot of times into trouble with it. Unnecessary confusion but it's part of the progress :)


## Why Redux way

React rocks. Structure of Redux based app is great and widely accepted.

So you know Redux (and even if you don't you can follow very easily, too).

Mimicking Redux with RxJS has 2 main benefits:

* you **do not have to learn new concept** and use React and HoC (higher order components) as you usually do
* you may **reuse most of your current app** if you decide to give RxJS and RxR a try in the battle (or in the test)

There are more benefits once you discover the RxJS functions. Hidden treasure!
