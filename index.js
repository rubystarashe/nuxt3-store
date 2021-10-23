import Store from './store'

export default function (moduleOptions) {
  const { options, addPlugin } = this
  const stores = options.stores || []
  addPlugin({
    src: __dirname + '/plugin.js',
    options: { moduleOptions, stores }
  })
}

export const store = storeObject => {
  if (typeof storeObject == 'object') {
    const { name, type, reactiveType, value } = storeObject
    return new Store({ storageKey: name, storageType: type, reactiveType }, value).state
  }
  return new Store({}).state
}
