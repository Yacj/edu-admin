import path from 'path-browserify'

export function resolveRoutePath(basePath?: string, routePath?: string) {
  return basePath ? path.resolve(basePath, routePath ?? '') : routePath ?? ''
}

/**
 * @description 深拷贝
 * @param obj - 要拷贝的对象
 * @returns 拷贝后的对象
 * @example
 * const obj = { a: 1, b: 2 }
 * deepClone(obj)
 */
export function deepClone<T>(obj: T): T {
  const map = new Map<any, any>()

  function clone(target: any): any {
    if (typeof target !== 'object' || target === null) {
      return target
    }

    if (map.has(target)) {
      return map.get(target)
    }

    if (target instanceof Date) {
      return new Date(target.valueOf())
    }

    if (target instanceof RegExp) {
      return new RegExp(target.source, target.flags)
    }

    if (target instanceof Error) {
      return new Error(target.message)
    }

    const type = Object.prototype.toString.call(target).replace(/\[object (\w+)\]/, '$1')
    const strategy: any = {
      Array: () => {
        const result: any = []
        map.set(target, result)
        for (const [index, value] of Object.entries(target)) {
          result[index] = clone(value)
        }
        return result
      },
      Object: () => {
        const result = Object.create(Object.getPrototypeOf(target))
        map.set(target, result)
        for (const [key, value] of Object.entries(target)) {
          result[key] = clone(value)
        }
        return result
      },
      Map: () => {
        const newMap = new Map()
        map.set(target, newMap)
        target.forEach((value: any, key: any) => {
          newMap.set(clone(key), clone(value))
        })
        return newMap
      },
      Set: () => {
        const newSet = new Set()
        map.set(target, newSet)
        target.forEach((item: any) => {
          newSet.add(clone(item))
        })
        return newSet
      },
      // Add support for more object types here
    }

    if (strategy[type]) {
      return strategy[type]()
    }
    else {
      // Unsupported types, return the original object
      return target
    }
  }

  return clone(obj)
}
