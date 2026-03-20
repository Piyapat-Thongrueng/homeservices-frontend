module.exports = {
  i18n: {
    defaultLocale: 'th',
    locales: ['en', 'th'],
  },
  localePath:
    typeof window === 'undefined'
      ? require('path').resolve('./public/locales')
      : '/locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}
