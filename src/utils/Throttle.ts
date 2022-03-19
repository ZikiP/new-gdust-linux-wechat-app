// 封装节流
import { useCallback, useEffect, useRef } from "react"

export function useThrottle(fn, delay, dep = []) {
  const { current } = useRef<any>({ fn, timer: null })
  useEffect(
    function () {
      current.fn = fn
    },
    [fn]
  )
  return useCallback(function f(...args) {
    if (!current.timer) {
      current.timer = setTimeout(() => {
        delete current.timer
      }, delay)
      current.fn.call(this, ...args)
    }
  }, dep)
}

