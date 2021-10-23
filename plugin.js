import Store from 'nuxt3-store/store'

export default defineNuxtPlugin(async nuxtApp => {
  const { moduleOptions, stores } = <%= JSON.stringify(options) %>
  stores.forEach(store => {
    let storage
    let storageName
    if (typeof store == 'string') {
      storage = new Store({})
      storageName = store
    }
    else if (typeof store == 'object') {
      const { name, type, storageName, storageType } = store
      storage = new Store({ storageType: type || storageType })
      storageName = name || storageName
    }
    if (!storageName || !storage) return
    nuxtApp.vueApp.provide(storageName, storage.state)
    nuxtApp.provide(storageName, storage.state)
    useState(
      storageName,
      () => storage.state
    )
  })
})
