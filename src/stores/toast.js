import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    show: false,
    data: {
      title: '',
      message: '',
      type: 'success'
    }
  }),
  getters: {
    getShowToast: (state) => state.show,
    getToastData: (state) => ({ ...state.data })
  },
  actions: {
    showToast() {
      this.show = true

      setTimeout(() => {
        this.show = false
        this.data = {
          title: '',
          message: '',
          type: 'success'
        }
      }, 5000)
    },
    setInfo(data) {
      const { title, message, type } = data
      this.data = { title, message, type }
    }
  }
})
