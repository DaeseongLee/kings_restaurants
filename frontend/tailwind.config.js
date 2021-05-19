module.exports = {
  purge: ['./src/**/*.tsx'], //난중에 배포할 때 필요한 css만 배포하도록 사용한 css 경로 지정해주는 곳
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
