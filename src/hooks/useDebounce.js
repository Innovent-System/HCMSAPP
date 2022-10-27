import { useEffect,useState } from "react"
import useTimeout from "./useTimeout"

// export default function useDebounce(callback, delay, dependencies) {
//   const { reset, clear } = useTimeout(callback, delay)
//   useEffect(reset, [...dependencies, reset])
//   useEffect(clear, [])
// }


export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}