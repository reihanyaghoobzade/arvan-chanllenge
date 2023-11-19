import { generalRequest } from '../services/requests'

export function apiPostRegisterUser(data, config = {}) {
  return generalRequest.post('/users', data, config)
}

export function apiPostLoginUser(data, config = {}) {
  return generalRequest.post('/users/login', data, config)
}

export function apiGetCurrentUser(config = {}) {
  return generalRequest.get('/user', config)
}

export function apiGetArticles(pageNumber, config = {}) {
  return generalRequest.get(`/articles/?offset=${pageNumber}`, config)
}

export function apiGetArticle(slug, config = {}) {
  return generalRequest.get(`/articles/${slug}`, config)
}

export function apiDeleteArticle(slug, config = {}) {
  return generalRequest.delete(`/articles/${slug}`, config)
}

export function apiPutArticle(slug, data, config = {}) {
  return generalRequest.put(`/articles/${slug}`, data, config)
}

export function apiPostArticle(data, config = {}) {
  return generalRequest.post('/articles', data, config)
}

export function apiGetAllTags(config = {}) {
  return generalRequest.get('/tags', config)
}
