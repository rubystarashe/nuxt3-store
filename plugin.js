import { defineNuxtPlugin, useState } from '#app'

import Store from 'nuxt3-store/store'

export default defineNuxtPlugin(async nuxtApp => {
  const { moduleOptions, stores } = <%= JSON.stringify(options) %>
  stores.forEach(store => {
    let storage
    let storageName
    if (typeof store == 'string') {
      storage = new Store({ storageKey: store })
      storageName = store
    }
    else if (typeof store == 'object') {
      const { name, type, reactiveType, value } = store
      storage = new Store({ storageKey: name, storageType: type, reactiveType }, value)
      storageName = name
    }
    if (!storageName || !storage) return
    nuxtApp.vueApp.provide(storageName, storage.state)
    nuxtApp.provide(storageName, storage.state)
  })
})
