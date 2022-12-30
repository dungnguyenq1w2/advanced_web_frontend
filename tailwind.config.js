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
                'show-slow': {
                    '0%': { opacity: 0 },
                    '50%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                'pulse-once': {
                    '0%': { opacity: 0.5, backgroundColor: '#dedede', borderRadius: '10px' },
                    '100%': { opacity: 1, backgroundColor: 'transparent' },
                },
            },
        },
    },
    plugins: [require('flowbite/plugin')],
}
