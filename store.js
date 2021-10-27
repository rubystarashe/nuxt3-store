import { reactive, readonly, shallowReactive, shallowReadonly, watch } from 'vue'

const reactiveTypes = {
  reactive,
  readonly,
  shallowReactive,
  shallowReadonly
}

class Store {
  constructor (options = {}, defaultValue = {}) {
    this.reactiveType = options.reactiveType || 'reactive'
    this.storageKey = options.storageKey || 'store'
    this.storageType = options.storageType
    this.expiresIn = options.expiresIn
    this.version = options.version || '1.0.0'

    this.defaultValue = defaultValue
    this.state = reactiveTypes[this.reactiveType](defaultValue)
    this.observer = {}
    this.updatedAt = new Date().getTime()
    switch (this.storageType) {
      case 'localStorage':
      case 'localstorage':
      case 'local':
        this.storageType = 'localStorage'
        break
      case 'sessionStorage':
      case 'sessionstorage':
      case 'session':
        this.storageType = 'sessionStorage'
        break
      default:
        this.storageType = null
        break
    }
    if (process.client) {
      if (this.storageType) {
        const now = new Date().getTime()
        const updatedAt = parseInt(window[this.storageType].getItem(this.storageKey + '_updatedAt')) || 0
        const version = window[this.storageType].getItem(this.storageKey + '_version')
        if ((now - updatedAt) > this.expiresIn || this.version != version) {
          window[this.storageType].setItem(this.storageKey + '_updatedAt', now)
          window[this.storageType].setItem(this.storageKey + '_version', this.version)
          window[this.storageType].setItem(this.storageKey, JSON.stringify(this.state))
        } else {
          const persistent = JSON.parse(window[this.storageType].getItem(this.storageKey)) || {}
          Object.keys(persistent).forEach(key => {
            this.state[key] = persistent[key]
          })
        }
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
    const updatedAt = parseInt(window[this.storageType].getItem(store.storageKey + '_updatedAt')) || 0
    const diff = updatedAt - store.updatedAt
    if (diff > 1) {
      const persistent = JSON.parse(window[this.storageType].getItem(store.storageKey))
      Object.keys(persistent).forEach(key => {
        store.state[key] = persistent[key]
      })
    } else {
      window[this.storageType].setItem(store.storageKey + '_updatedAt', now)
      window[this.storageType].setItem(store.storageKey + '_version', store.version)
      window[this.storageType].setItem(store.storageKey, JSON.stringify(store.state))
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
