import { addAuthRequiredInterceptorHandler } from '@/api/interceptors/handle-auth-required'

export const interceptors = [
  addAuthRequiredInterceptorHandler
]
