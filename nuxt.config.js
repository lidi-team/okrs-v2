import pureCssConfig from './purecss.config';
import accessEnv from './utils/accessEnv';

export default {
  server: {
    port: accessEnv('PORT'),
  },
  /**
   * @description Passing dynamic config and environment variables to the nuxt context
   * @docs https://nuxtjs.org/api/configuration-runtime-config#-code-publicruntimeconfig-code-
   */
  publicRuntimeConfig: {
    baseURL: accessEnv('BASE_URL'),
    port: accessEnv('PORT'),
  },
  /**
   * @description Nuxt rendering mode
   * @docs https://nuxtjs.org/api/configuration-mode
   */
  mode: 'spa',
  /**
   * @description Nuxt target
   * @docs https://nuxtjs.org/api/configuration-target
   */
  target: 'static',
  /**
   * @description Headers of the page
   * @docs https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Global CSS
   */
  css: [],
  /**
   * @description Plugins to load before mounting the App
   * @docs https://nuxtjs.org/guide/plugins
   */
  plugins: ['@/plugins/element-ui'],
  /**
   * @description Auto import components
   * @docs https://nuxtjs.org/api/configuration-components
   */
  components: true,
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/stylelint-module', '@nuxtjs/tailwindcss', ['nuxt-purgecss', { pureCssConfig }]],
  tailwindcss: {
    configPath: './tailwind.config.js',
    cssPath: '@/assets/css/tailwind.css',
    purgeCSSInDev: false,
    exposeConfig: false,
  },
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/axios', '@nuxtjs/pwa'],
  /**
   * @description Axios module configuration
   * @docs https://axios.nuxtjs.org/options
   */
  axios: {},
  /**
   * @description Build configuration
   * @docs https://nuxtjs.org/api/configuration-build/
   */
  build: {
    // analyze: true,
    extractCSS: true,
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.(css|vue)$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
  },
};
