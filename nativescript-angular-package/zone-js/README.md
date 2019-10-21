Zone.js for NativeScript
---

Zone.js is a library that aims to intercept all asynchronous API calls made in an environment, in order 
to wrap them into coherent execution contexts over time.
 
NativeScript executes inside an environment that Zone.js is not designed to work in, so a custom Zone.js output 
must be created.

Find out more about this in the [Upgrading Zone.js document](../../doc/upgrading-zonejs.md)