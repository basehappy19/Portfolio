'use client'

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeSwitch() {
    const { theme, setTheme } = useTheme()

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
            {theme === "dark" ? (
                <Sun className="w-5 h-5" />
            ) : (
                <Moon className="w-5 h-5" />
            )}
        </button>
    )
}
