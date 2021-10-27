import Store from './store'

export default function (moduleOptions) {
  const { options, addPlugin } = this
  const stores = options.stores || []
  const configVersion = options.version || '1.0.0'
  addPlugin({
    src: __dirname + '/plugin.js',
    options: { moduleOptions, stores, configVersion }
  })
}

export const store = storeObject => {
  if (typeof storeObject == 'object') {
    const { name, type, reactiveType, value } = storeObject
    return new Store({ storageKey: name, storageType: type, reactiveType }, value).state
  }
  return new Store({}).state
}
