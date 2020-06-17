import AxiosPlugin from './plugins/axios'

export default ({ $axios, store, app }) => {
  AxiosPlugin({ $axios, store, app })
}
