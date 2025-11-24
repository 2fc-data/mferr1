interface ThemeToggleProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const ThemeToggle = ({ theme, toggleTheme }: ThemeToggleProps) => {
  return (
    <button
      onClick={toggleTheme}
      className="button px-4 py-2
                 text-black dark:text-white
                 bg-white dark:bg-gray-800
                 transition-colors"
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};
