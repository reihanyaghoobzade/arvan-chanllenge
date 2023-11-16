import axios from 'axios'
import { camelize, snakize } from '@/utils/convert-to-camel-snake'
import TokenService from './token'

const addAuthTokenInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      return {
        ...(config || {}),
        headers: {
          ...(config?.headers || {}),
          Authorization: `Token ${TokenService.getToken()}`
        }
      }
    },
    (e) => {
      return Promise.reject(e)
    }
  )
}

const snakizeInterceptor = (instance) => {
  instance.interceptors.request.use(
    (config) => {
      return {
        ...config,
        params: snakize(config.params || {}),
        data: config.data ? snakize(config.data) : undefined
      }
    },
    (e) => {
      return Promise.reject(e)
    }
  )
}

const addResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
    (res) => {
      if (res && res.data) return camelize(res.data)
      return res
    },
    (e) => {
      return Promise.reject(e)
    }
  )
}

const createPureInstance = (baseUrl, { headers, ...configs } = {}) => {
  return axios.create({
    timeout: 15000,
    baseURL: baseUrl,
    headers: {
      ...(headers || {})
    },
    ...configs
  })
}

const createInstance = (baseUrl, configs = {}) => {
  const instance = createPureInstance(baseUrl, configs)
  addAuthTokenInterceptor(instance)
  snakizeInterceptor(instance)
  addResponseInterceptor(instance)

  return instance
}

export { createPureInstance, createInstance }
