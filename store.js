import { reactive, readonly, shallowReactive, shallowReadonly, watch } from 'vue'

const reactiveTypes = {
  reactive,
  readonly,
  shallowReactive,
  shallowReadonly
}

class Store {
  constructor (options = {}) {
    this.reactiveType = options.reactiveType || 'reactive'
    this.storageKey = options.storageKey || 'store'
    this.storageType = options.storageType

    this.state = reactiveTypes[this.reactiveType]({})
    this.observer = {}
    this.updatedAt = new Date().getTime()
    if (process.client) {
    if (this.storageType == 'localstorage') {
      const persistent = JSON.parse(window.localStorage.getItem(this.storageKey)) || {}
        Object.keys(persistent).forEach(key => {
          this.state[key] = persistent[key]
        })
        window.addEventListener('storage', event => {
          if (event?.key == this.storageKey && JSON.stringify(this.state) != event.newValue) {
            this.storageSyncOnce(this)
          }
        })
        this.storageSync(this)
      }
    }
  }
  storageSyncOnce (store = this) {
    const now = new Date().getTime()
    const updatedAt = window.localStorage.getItem(store.storageKey + '_updatedAt')
    const diff = updatedAt - store.updatedAt
    if (diff > 1) {
      const persistent = JSON.parse(window.localStorage.getItem(store.storageKey))
      Object.keys(persistent).forEach(key => {
        store.state[key] = persistent[key]
      })
    }
    else {
      window.localStorage.setItem(store.storageKey + '_updatedAt', now)
      window.localStorage.setItem(store.storageKey, JSON.stringify(store.state))
    }
    store.updatedAt = now
    return store
  }
  storageSync (store = this) {
    if (!store?.storageType) return store
    this.storageDeSync(store)
    store.observer[store.storageType] = watch(store.state, () => this.storageSyncOnce(store))
    return store
  }
  storageDeSync (store = this) {
    store?.observer?.[store.storageType]?.()
    return store
  }
}

export default Store
