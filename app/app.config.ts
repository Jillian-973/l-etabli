export default defineAppConfig({
  ui: {
    // La couleur d'accent de tout le site = terre cuite
    colors: {
      primary: 'terracotta',
      neutral: 'stone',
    },
    button: {
      slots: {
        base: 'font-medium rounded-lg transition-colors',
      },
    },
  },
})
