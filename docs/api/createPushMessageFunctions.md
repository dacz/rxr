# createPushMessageFunctions

Turns an object whose values are Rx.Subjects, into an object with the
same keys, but their values are not Subjects but functions, that
may be called directly with data you want to push to Subject.
So instead of using `userClicksS.next('buttonX')`
once you do `const userClicked = createPushMessageFunctions(userClicks)` and then
just use `userClicked('buttonX')`.

For convenience, you can also pass a single Subject as the first argument,
and get a function in return.

**Parameters**

- `Subject` **(Observable | Object)** An object whose values are Rx.Subject. You may also pass a single Observable.


**Returns**

- **(Function) | Object)** Object mimicking the original object, but with values changed from Rx.Subject to ordinary functions you can call with values that will be passed to the Subject as `.next()`.  
When you called with Observable, single function is returned.
