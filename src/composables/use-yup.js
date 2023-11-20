import { computed, ref } from 'vue'

const useYup = (schema, options = { abortEarly: false }) => {
  const errors = ref([])
  const errorTextFor = (path) => {
    const error = errors.value.find((e) => e.path === path)
    return error ? error.message : ''
  }

  const validate = async (values) => {
    try {
      await schema.validate(values, options)
      errors.value = []
      return true
    } catch (error) {
      errors.value = error.inner
      return false
    }
  }

  const objectError = computed(() => {
    return errors.value.reduce((prev, err) => {
      return err.path ? { ...prev, [err.path]: err?.message } : { ...prev, error: err?.message }
    }, {})
  })

  const validateAt = async (path, values) => {
    const hasFieldError = errors.value.find((_err) => _err.path === path)
    try {
      const value = await schema.validateAt(path, values)
      errors.value = errors.value.filter((_err) =>
        Array.isArray(value) ? !_err.path.includes(`${path}[`) : _err.path !== path
      )
      return true
    } catch (err) {
      errors.value = hasFieldError
        ? errors.value.map((_err) => (_err.path === path ? err : _err))
        : [...errors.value, err]

      return false
    }
  }

  const validateFields = async (paths, values) => {
    if (!paths.length) return true
    const isValidatedFields = await Promise.all(paths.map((path) => validateAt(path, values)))
    return !isValidatedFields.some((validated) => validated === false)
  }

  return { validate, validateAt, validateFields, errorTextFor, objectError }
}

export { useYup }
