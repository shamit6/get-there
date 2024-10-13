const { colors } = require('tailwindcss/defaultTheme');

module.exports = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx}',
        './components/**/*.{js,ts,jsx,tsx}',
        './app/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--primary-color)',
                secondary: 'var(--secondery-color)',
                font: 'var(--font-color)',
                bg: 'var(--bg-color)',
                heading: 'var(--heading-color)',
                'heading-font': 'var(--heading-font-color)',
                'disabled-input': 'var(--disabled-input-color)',
                warning: 'var(--warning-color)',
                error: 'var(--error-color)',
                ticker: 'var(--ticker-color)',
                'timeline-period': 'var(--timeline-period-color)',
            },
        },
    },
    plugins: [],
}
