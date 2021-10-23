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
    const { type, reactiveType } = storeObject
    return new Store({ storageType: type, reactiveType }).state
  }
  return new Store({}).state
}
