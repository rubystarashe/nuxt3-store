# nuxt3-store
Nuxt3 Store!
Make a simple global state store with persistent option on Nuxt3

![Alt Text](https://i.imgur.com/5DAh6tT.gif)    


# Readme Translation
한국어 링크: <https://github.com/rubystarashe/nuxt3-store/blob/master/README-kor.md>

# Installation
```
npm i nuxt-vuex-localstorage
```
```js
// nuxt.config.js/ts
export default {
  modules: ['nuxt3-store']
}
```

# Usage
You can make store state with Nuxt3 config option array
```js
// nuxt.config.js/ts
export default {
  modules: ['nuxt3-store'],
  stores: [
    'storename',  // w/o persistence. state value is {}
    {
      name: 'storename2',  // storage key name
      type: 'localstorage',  // webstorage type for persistent mode. if not entered, any webstorage will not be used. localstorage|sessionstorage
      value: {  // default value is {}
        test: 'hello'
      },
      reactiveType: 'reactive',  // if not entered, reactive is the default. reactive|readonly|shallowReactive|shallowReadonly
      expiresIn: 1000, // expire time ms. if not entered, the persistent state is permanent
      version: '1.0.0'  // state store version. if the set version and persisted version are different, the state will be reset to default value when the page is loaded
    }
  ]
}

// module options
export default {
  ...
  version: '1.0.0', // you can set this version option for the default status version of every state store
  modules: [['nuxt3-store', {
    expiresIn: 1000, // expire time ms. if not entered, the persistent state is permanent
    version: '1.0.0' // if not entered, config version option is set here
  }]],
  ...
}
```

```html
<template>
<div v-if="isReady">
  {{$storename}}
  {{$storename2}}
</div>
</template>

<script setup>
const { $storename, $storename2 } = useNuxtApp()

let isReady = ref(false)  // if you are using persistent states, you have to render the persistent states after mounted or you will get some hydration errors
onMounted(() => {
  isReady.value = true
})
</script>
```

```js
// ./composables/composablemethod.js
import { useNuxtApp } from '#app'
const method = () => {
  const { $storename } = useNuxtApp()
  ...
  /* function with store state */
  ...
}
export default method
```

# Composable States
You can make composable state with nuxt composables directory usage
```js
// ./composables/storename.js
import { store } from 'nuxt3-store'
export default store({ name: 'storename', type: 'localstorage', value: { test: 'hello' }, reactiveType: 'reactive', version: '1.0.0', expiresIn: 1000 })
```
```js
// ./composables/storename2.js
import { store } from 'nuxt3-store'
let storename2 = store()
storename2.test = 'hello world'
export default storename2
```

```html
<template>
<div v-if="isReady">
  {{store}}
  {{store2}}
</div>
</template>

<script setup>
const store = storename
const store2 = storename2

let isReady = ref(false)
onMounted(() => {
  isReady.value = true
})
</script>
```


# Todo List/
1. support cookie mode
2. crypto storage
