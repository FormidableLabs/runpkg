# dora

> the online package explorer

An interface that lets you navigate around the imports of any es module on npm. Use the tool to learn more about the inner workings of your project dependencies; what they require, the size of specific imports and the dependency chain length as well as other useful metadata.

Eventually we hope to be able to offer dependency tree flattening with dead code elimination and minification.

![dora](https://user-images.githubusercontent.com/1457604/56382218-d68ade00-620e-11e9-8e2b-41fd1ca4d8a2.gif)


# Tests 

We're doing testing via cypress.

First 

```npx servor```

Then

```npx cypress open --env env=local```