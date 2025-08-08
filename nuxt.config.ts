// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  modules: ['@nuxt/fonts', '@nuxt/icon', '@nuxtjs/tailwindcss', 'nuxt-umami', '@nuxtjs/i18n'],
  runtimeConfig: {
    public: {
      umami: {
        host: process.env.UMAMI_HOST || '',
        id: process.env.UMAMI_ID || '',
      }
    }
  },
  umami: {
    host: process.env.UMAMI_HOST || '',
    id: process.env.UMAMI_ID || '',
    autoTrack: true,
    cache: false,
    useDirective: true,
    logErrors: true,        
    // Allow localhost for testing
    ignoreLocalhost: false,
    enableTracker: true,
  },
  
  i18n: {
    defaultLocale: 'en',
    locales: [
      { code: 'en', name: 'English', file: 'en.json' },
      { code: 'pt', name: 'Português', file: 'pt.json' },
      { code: 'fr', name: 'Français', file: 'fr.json' },
      { code: 'es', name: 'Español', file: 'es.json' },
      { code: 'de', name: 'Deutsch', file: 'de.json' },
      { code: 'it', name: 'Italiano', file: 'it.json' }
    ],
    lazy: true,
    langDir: '../locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'en'
    },
    strategy: 'prefix_except_default'
  },
  app: {
    head: {
      title: 'Deck Optimize - Card Game Probability Calculator',
      titleTemplate: '%s | Deck Optimize',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'Calculate the exact probability of drawing specific card combinations in your opening hand. Perfect for Yu-Gi-Oh!, Magic: The Gathering, Pokémon, and other trading card games. Optimize your deck with mathematical precision.',
        },
        {
          hid: 'keywords',
          name: 'keywords',
          content: 'deck optimizer, card game probability, hypergeometric calculator, yugioh probability calculator, magic the gathering calculator, pokemon deck calculator, opening hand probability, deck building tool, trading card game math, card draw probability',
        },
        { name: 'author', content: 'Deck Optimize' },
        { name: 'robots', content: 'index, follow' },
        { name: 'theme-color', content: '#10b981' },
        
        // Open Graph Meta Tags
        { property: 'og:title', content: 'Deck Optimize - Card Game Probability Calculator' },
        { property: 'og:description', content: 'Calculate the exact probability of drawing specific card combinations in your opening hand. Perfect for Yu-Gi-Oh!, Magic: The Gathering, Pokémon, and other trading card games.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://deckoptimize.com' },
        { property: 'og:image', content: 'https://deckoptimize.com/og-image.jpg' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Deck Optimize - Card Game Probability Calculator Interface' },
        { property: 'og:site_name', content: 'Deck Optimize' },
        { property: 'og:locale', content: 'en_US' },
        
        // Twitter Card Meta Tags
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@deckoptimize' },
        { name: 'twitter:creator', content: '@deckoptimize' },
        { name: 'twitter:title', content: 'Deck Optimize - Card Game Probability Calculator' },
        { name: 'twitter:description', content: 'Calculate the exact probability of drawing specific card combinations in your opening hand. Perfect for Yu-Gi-Oh!, Magic, Pokémon, and other TCGs.' },
        { name: 'twitter:image', content: 'https://deckoptimize.com/twitter-image.jpg' },
        { name: 'twitter:image:alt', content: 'Deck Optimize - Card Game Probability Calculator Interface' },
        
        // Additional SEO meta tags
        { name: 'application-name', content: 'Deck Optimize' },
        { name: 'apple-mobile-web-app-title', content: 'Deck Optimize' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'format-detection', content: 'telephone=no' },
      ],      
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        { rel: 'canonical', href: 'https://deckoptimize.com' }       
      ],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Deck Optimize',
            description: 'Calculate the exact probability of drawing specific card combinations in your opening hand. Perfect for Yu-Gi-Oh!, Magic: The Gathering, Pokémon, and other trading card games.',
            url: 'https://deckoptimize.com',
            applicationCategory: 'GameApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD'
            },
            creator: {
              '@type': 'Organization',
              name: 'Deck Optimize'
            },
            keywords: 'deck optimizer, card game probability, hypergeometric calculator, opening hand probability'
          })
        }
      ]
    }
  },
})