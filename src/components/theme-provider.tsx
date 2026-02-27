import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type Props = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type State = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: State = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<State>(initialState)

export const ThemeProvider: React.FC<Props> = ({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}) => {
  const [theme, setTheme] = useState<Theme>(() => defaultTheme)

  useEffect(() => {
    setTheme((localStorage.getItem(storageKey) as Theme) || defaultTheme)
  }, [])

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light"

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}