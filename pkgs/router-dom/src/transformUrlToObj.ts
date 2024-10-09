export default function restructureObject(routes: { [key: string]: any }): {
  [key: string]: any
} {
  const result: any = {}

  for (const key in routes) {
    const value = routes[key]

    const parts = key.split('/')
    if (parts.length > 1) {
      console.log(parts)
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
    }
  }

  return result
}
