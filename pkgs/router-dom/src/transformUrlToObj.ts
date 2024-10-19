import { TMurypRouteList } from './types'

export default function restructureObject(routes: {
  [key: string]: any
}): TMurypRouteList {
  const result: any = {}

  for (const key in routes) {
    const value = routes[key]

    const parts = key.split('/')
    if (parts.length > 1) {
      let current = result
      while (parts.length > 1) {
        const part = parts.shift()!
        current[part] = current[part] || {}
        current = current[part]
      }
      current[parts[0]] = value
      // Jika nilai adalah objek, rekursif panggil fungsi ini
    } else if (typeof value === 'object' && value.length === undefined) {
      result[key] = restructureObject(value)
    } else {
      result[key] = value
    }
  }

  return result
}