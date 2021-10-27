# nuxt3-store
Nuxt3 에서 간단한 설정으로 전역 상태 저장소를 만들 수 있습니다. 웹스토리지를 이용하여 상태값이 저장되게 할 수도 있습니다.

![Alt Text](https://i.imgur.com/5DAh6tT.gif)    


# 설치
```
npm i nuxt-vuex-localstorage
```
```js
// nuxt.config.js/ts
export default {
  modules: ['nuxt3-store']
}
```

# 사용법
Nuxt3 모듈 설정에 스토어 배열을 작성하는것으로 전역 상태 저장소를 간단하게 생성할 수 있습니다.
```js
// nuxt.config.js/ts
export default {
  modules: ['nuxt3-store'],
  stores: [
    'storename',  // 종료 시 상태가 휘발되는 빈 객체 {} 상태를 생성합니다
    {
      name: 'storename2',  // 저장소 식별 이름입니다
      type: 'localstorage',  // 상태 저장 모드입니다. 입력 시 웹스토리지를 사용하여 브라우저가 종료되더라도 상태가 유지될 수 있게 합니다 localstorage|sessionstorage
      value: {  // 입력하지 않으면 빈 객체 {} 가 할당됩니다
        test: 'hello'
      },
      reactiveType: 'reactive',  // 기본값은 reactive 입니다. reactive|readonly|shallowReactive|shallowReadonly
      expiresIn: 1000, // 상태 저장소가 만료되기까지의 유지 시간을 설정합니다. ms 단위. 설정하지 않으면 영구히 지속됩니다
      version: '1.0.0'  // 상태 저장소의 버전입니다. 저장된 버전과 설정된 버전이 다르면 값이 초기화됩니다
    }
  ]
}

// module options
export default {
  ...
  version: '1.0.0', // 버전 옵션을 지정하면 이 값을 읽어 상태 저장소의 기본 버전으로 활용할 수도 있습니다
  modules: [['nuxt3-store', {
    expiresIn: 1000, // 상태 저장소가 만료되기까지의 유지 시간을 설정합니다. ms 단위. 설정하지 않으면 영구히 지속됩니다
    version: '1.0.0' // 입력하지 않으면, version 옵션을 참조하여 사용합니다
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

let isReady = ref(false)
onMounted(() => { // 로컬스토리지 모드 등의 상태 저장 모드를 사용중이라면 onMounted 이후에 값이 랜더링 되어야 Hydration 오류를 피할 수 있습니다
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

# Composables mode
Nuxt3의 composables 디렉토리에 파일을 생성하고 모듈을 호출하여 사용하는 것으로 composable 상태 저장소를 생성할 수 있습니다
```js
// ./composables/storename.js
import { store } from 'nuxt3-store'
export default store({ name: 'storename', type: 'localstorage', value: { test: 'hello' }, reactiveType: 'reactive' })
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
