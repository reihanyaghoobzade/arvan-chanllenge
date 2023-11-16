import { useMutation } from '@tanstack/vue-query'
import { apiPostLoginUser, apiPostRegisterUser } from '../data/api'

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
