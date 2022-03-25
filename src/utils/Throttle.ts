// 封装节流
import { useCallback, useEffect, useRef } from "react"

/**
 * 节流hooks
 * @param fn 需要节流的函数
 * @param delay 间隔
 * @param dep 空数组，无需传入参数
 * @returns
 */
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

