import { useMutation, useQuery } from '@tanstack/vue-query'
import {
  apiDeleteArticle,
  apiGetArticle,
  apiGetArticles,
  apiGetAllTags,
  apiPutArticle,
  apiPostArticle
} from '../data/api'

export const useArticles = (key) => {
  return useQuery({ queryKey: key, queryFn: apiGetArticles })
}

export const useEditArticle = (slug, config) =>
  useQuery({ queryKey: ['edit-article', { slug }], queryFn: () => apiGetArticle(slug), ...config })

export const useDeleteArticle = () => useMutation({ mutationFn: (slug) => apiDeleteArticle(slug) })

export const useUpdateArticle = (slug) =>
  useMutation({ mutationFn: (data) => apiPutArticle(slug, data) })

export const useCreateArticle = () => useMutation({ mutationFn: (data) => apiPostArticle(data) })

export const useAllTags = () => useQuery({ queryKey: ['all-tags'], queryFn: apiGetAllTags })
