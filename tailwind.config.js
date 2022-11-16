/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{html,js,jsx,ts,tsx}',
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            keyframes: {
                'slip-down': {
                    '0%': { top: '-1rem', opacity: 0 },
                    '40%': { top: '3.5rem', opacity: 0 },
                    '70%': { opacity: 1 },
                    '100%': { top: '4.5rem' },
                },
            },
        },
    },
    plugins: [require('flowbite/plugin')],
}
