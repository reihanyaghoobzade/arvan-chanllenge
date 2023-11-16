import { useQuery } from '@tanstack/vue-query'
import { apiGetArticles } from '../data/api'

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: () => apiGetArticles()
  })
}
