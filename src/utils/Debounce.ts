import { useCallback, useEffect, useRef } from "react";

export function useDebounce(fn, delay, dep = []) {
  const { current } = useRef<any>({ fn, timer: null });
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
