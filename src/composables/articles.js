import { useMutation, useQuery } from '@tanstack/vue-query'
import { apiDeleteArticle, apiGetArticles } from '../data/api'

export const useArticles = (key) => {
  return useQuery({
    queryKey: key,
    queryFn: () => apiGetArticles()
  })
}

export const useDeleteArticle = () => {
  return useMutation({
    mutationFn: (slug) => apiDeleteArticle(slug)
  })
}
