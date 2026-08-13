/** Read a dotted path ("services.items.0.title") out of a nested object. */
export function getPath(obj, path) {
  return path
    .split('.')
    .reduce((acc, key) => (acc === null || acc === undefined ? undefined : acc[key]), obj)
}

/** Write a dotted path, creating containers on the way. */
export function setPath(obj, path, value) {
  const keys = path.split('.')
  const last = keys.pop()
  let cursor = obj
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i]
    if (cursor[key] === null || cursor[key] === undefined) {
      // The *next* segment decides the container type: "items.0.title" needs
      // `items` to be an array, not an object.
      const nextKey = i + 1 < keys.length ? keys[i + 1] : last
      cursor[key] = /^\d+$/.test(nextKey) ? [] : {}
    }
    cursor = cursor[key]
  }
  cursor[last] = value
}

/** "services.items.0.color" + "textColor" -> "services.items.0.textColor" */
export function siblingPath(path, key) {
  const keys = path.split('.')
  keys[keys.length - 1] = key
  return keys.join('.')
}

export function deepClone(value) {
  return JSON.parse(JSON.stringify(value))
}

export function deepEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b)
}
