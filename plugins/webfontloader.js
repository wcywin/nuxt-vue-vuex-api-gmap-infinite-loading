import WebFontLoader from 'webfontloader'

export default () => {
  WebFontLoader.load({
    google: {
      families: ['Raleway:300,400,700,800,900&display=swap']
    }
  })
}
