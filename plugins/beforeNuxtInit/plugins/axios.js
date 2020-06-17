import { Api } from '@/api'

export default function ({ $axios, store }) {
  store.$api = new Api($axios)
}
