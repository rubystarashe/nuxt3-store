import { resolve } from 'path'

export default function (moduleOptions) {
  const { options, addPlugin } = this
  const stores = options.stores || []
  
  addPlugin({
    src: resolve(__dirname, './plugin.js'),
    ssr: false,
    options: { moduleOptions, stores }
  })
}
