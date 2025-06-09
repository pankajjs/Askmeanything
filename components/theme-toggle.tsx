"use client"

import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    theme == "dark" ? <SunIcon onClick={() => setTheme("light")}/> : <MoonIcon onClick={() => setTheme("dark")}/>
  )
}
