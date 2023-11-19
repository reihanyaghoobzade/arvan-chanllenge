import { useMutation, useQuery } from '@tanstack/vue-query'
import { apiPostLoginUser, apiPostRegisterUser, apiGetCurrentUser } from '../data/api'
import TokenService from '../data/services/token'

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: (data) => apiPostRegisterUser(data)
  })
}

export const useLoginUser = () => {
  return useMutation({
    mutationFn: (data) => apiPostLoginUser(data)
  })
}

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user', TokenService.getToken()],
    queryFn: apiGetCurrentUser
  })
}
