import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'
import transform from 'lodash/transform'

export function camelize(obj) {
  return transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key)
    acc[camelKey] = isObject(value) ? camelize(value) : value
  })
}

export function snakize(obj) {
  return transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : snakeCase(key)
    acc[camelKey] = isObject(value) ? snakize(value) : value
  })
}
