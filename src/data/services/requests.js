import { createInstance } from './instance'

const generalRequest = createInstance(import.meta.env.VITE_API_URL)

export { generalRequest }
