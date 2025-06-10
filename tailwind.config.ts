/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            transitionTimingFunction: {
                'mobile-smooth': 'cubic-bezier(0.4, 0, 0.2, 1)', // similar a mobile
            }
        }
    },
    plugins: [],
};
