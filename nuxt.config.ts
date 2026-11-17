export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    mongodbUri: '',
    mongodbDbName: 'cbyc_invitations',
    guestbookAdminToken: ''
  },
  app: {
    head: {
      title: 'Élise & Antoine — Notre mariage',
      meta: [{ name: 'description', content: 'Une invitation de mariage élégante et naturelle imaginée par C by C.' }]
    }
  }
})
