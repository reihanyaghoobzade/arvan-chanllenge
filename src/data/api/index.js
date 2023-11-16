import { generalRequest } from '../services/requests'

export function apiPostRegisterUser(data, config = {}) {
  return generalRequest.post('/users', data, config)
}

export function apiPostLoginUser(data, config = {}) {
  return generalRequest.post('/users/login', data, config)
}

export function apiGetArticles(config = {}) {
  return generalRequest.get('/articles', config)
}
