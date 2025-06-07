import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Remove after testing
export const wordGen = (n: number) => {
  let ans = "a"
  for (let i = 0; i < n; i++) {
    ans += "a"
  }
  return ans
}
