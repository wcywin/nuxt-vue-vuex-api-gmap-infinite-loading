import { resources } from '@/api/resources'
import { interceptors } from '@/api/interceptors'

export class Api {
  constructor ($http) {
    interceptors.forEach(interceptor => interceptor($http.interceptors))
    this.resources = new Proxy(resources, {
      get (target, name) {
        return target[name]($http)
      }
    })
  }
}
