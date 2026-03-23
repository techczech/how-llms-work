import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/context/Theme'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className={`p-1.5 rounded-lg transition-colors ${
        theme === 'dark'
          ? 'text-gray-400 hover:text-white hover:bg-white/10'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200'
      } ${className}`}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  )
}
