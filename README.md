<svg xmlns="http://www.w3.org/2000/svg" width="100" height="52" viewBox="0 0 395.98 212.989"><path d="M150.666 74.792c-6.625-9.138-12.98-15.823-19.069-20.063-6.093-4.237-12.188-6.356-18.275-6.356-7.022 0-13.541 1.49-19.567 4.47-6.027 2.979-11.322 7.021-15.892 12.117-4.568 5.099-8.146 11.058-10.728 17.878-2.582 6.823-3.873 14.005-3.873 21.554v94.933H17.175V13.808h46.882v20.659c3.046-3.443 6.485-6.685 10.33-9.734a75.322 75.322 0 0 1 12.315-7.946 66.923 66.923 0 0 1 13.806-5.264 58.512 58.512 0 0 1 14.8-1.887c10.727 0 20.957 1.688 30.69 5.065 9.734 3.377 19.026 13.66 25.923 21.443 22.302 25.167 80.082 102.413 80.082 102.413 6.627 9.138 12.984 15.82 19.07 20.062 6.092 4.238 12.189 6.356 18.275 6.356 7.023 0 13.541-1.489 19.566-4.47 6.03-2.979 11.322-7.023 15.892-12.117 4.568-5.1 8.146-11.059 10.728-17.879 2.583-6.825 3.874-14.004 3.874-21.553V13.808h46.086v185.735h-46.881v-20.66c-3.046 3.443-6.483 6.683-10.329 9.734a75.56 75.56 0 0 1-12.316 7.944 66.94 66.94 0 0 1-13.807 5.265 58.48 58.48 0 0 1-14.799 1.887c-10.728 0-20.957-1.688-30.69-5.064s-19.025-13.656-25.924-21.443c-22.304-25.168-80.082-102.414-80.082-102.414z"/><linearGradient id="a" gradientUnits="userSpaceOnUse" x1="184.602" y1="121.422" x2="132.919" y2="210.939"><stop offset="0" stop-color="#4a2a8f"/><stop offset=".124" stop-color="#6a308f"/><stop offset=".333" stop-color="#9a3990"/><stop offset=".531" stop-color="#c04190"/><stop offset=".715" stop-color="#db4691"/><stop offset=".876" stop-color="#eb4991"/><stop offset="1" stop-color="#f14a91"/></linearGradient><path fill="url(#a)" d="M196.57 147.161l-32.018 52.162h-51.753l58.311-85.69z"/><linearGradient id="b" gradientUnits="userSpaceOnUse" x1="216.875" y1="90.995" x2="267.78" y2="2.824"><stop offset="0" stop-color="#4a2a8f"/><stop offset=".124" stop-color="#6a308f"/><stop offset=".333" stop-color="#9a3990"/><stop offset=".531" stop-color="#c04190"/><stop offset=".715" stop-color="#db4691"/><stop offset=".876" stop-color="#eb4991"/><stop offset="1" stop-color="#f14a91"/></linearGradient><path fill="url(#b)" d="M205.763 66.3l31.778-52.492h49.265l-56.019 85.219z"/></svg>

# RxR - RxJS the Redux way

[![Build Status](https://travis-ci.org/dacz/rxr.svg?branch=master)](https://travis-ci.org/dacz/rxr)
[![npm](https://img.shields.io/npm/v/rxr.svg?maxAge=2592000)](https://www.npmjs.com/package/rxr)

RxR uses [RxJS](https://github.com/ReactiveX/rxjs) to mimick Redux way of structuring (not only) a React app.

**Rewrite current react-redux app with RxJS/RxR is straightforward.**  You can left most of the main code nearly intact when you learn RxJS with RxR.

**RxJS is great. Try it.**

RxR is a really tiny layer, mostly helpers. You don't need to use RxR or learn RxR specific syntax (except RxJS but this is the aim). This is what I like on Redux a lot and this is what I wanted to have in RxR.

This is work in progress. Two packages ([rxr](https://github.com/dacz/rxr) and [rxr-react](https://github.com/dacz/rxr-react)). First versions. A lot to do. Opinions and help welcome.

Read more in [RxR docs](http://dacz.github.io/rxr) where you can see Redux and appropriate RxR code side by side and you will get into how (simple) RxR works thanks to RxJS.

**Here is demo app with docs about differences between Redux and RxR**: [rxr-redux-example](https://github.com/dacz/rxr-redux-example).

## Install

```
npm install --save rxr rxr-react
```
