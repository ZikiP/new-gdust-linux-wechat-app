import { useCallback, useEffect, useRef } from "react";

type currentType = {
  fn: Function,
  timer: any
}

/**
 * 防抖hooks
 * @param fn 需要防抖的函数
 * @param delay 间隔
 * @param dep 空数组，无需输入任何东西
 * @returns
 */
export function useDebounce(fn: Function, delay: number, dep:Array<any> = []) {

  const { current } = useRef<currentType>({ fn, timer: null });

  useEffect(function () {
    current.fn = fn;
  }, [fn]);

  return useCallback(function f(...args) {
    if (current.timer) {
      clearTimeout(current.timer);
    }
    current.timer = setTimeout(() => {
      current.fn.call(this, ...args);
    }, delay);
  }, dep)

}
