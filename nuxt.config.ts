import { NuxtConfig } from '@nuxt/types';
import { Configuration as WebpackConfig } from 'webpack';
import { NuxtRouteConfig } from '@nuxt/types/config/router';
import StylelintWebpackPlugin from 'stylelint-webpack-plugin';
import pureCssConfig from './purecss.config';
import accessEnv from './utils/accessEnv';

const nuxtConfig: NuxtConfig = {
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
  plugins: [
    {
      src: '@/plugins/element-ui.ts',
    },
    {
      src: '@/plugins/vue-fragment.ts',
    },
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/stylelint-module', '@nuxtjs/tailwindcss', ['nuxt-purgecss', { pureCssConfig }]],
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
  // router: {
  //   prefetchLinks: false,
  // },
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
    // fixed netlify deploy
    // https://github.com/nuxt/nuxt.js/issues/5800#issuecomment-597009572
    html: {
      minify: {
        collapseWhitespace: true,
        removeComments: true,
      },
    },
    babel: {
      presets({ isServer }) {
        return [['@nuxt/babel-preset-app', { loose: true }]];
      },
    },
    extend(config: WebpackConfig, { isDev, isClient }: any) {
      if (isDev && isClient && config.module) {
        // Enabling eslint:
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|ts|vue)$/u,
          loader: 'eslint-loader',
          exclude: /(node_modules)/u,
        });

        if (config.plugins) {
          // Enabling stylelint:
          config.plugins.push(
            new StylelintWebpackPlugin({
              files: '**/*.{vue,scss,css}',
            }),
          );
        }
      }
    },
  },
  router: {
    extendRoutes(routes: NuxtRouteConfig[], resolve: any): void {
      const indexRoute = routes.find((r) => r.name === 'index');
    },
  },
  watchers: {
    webpack: {
      poll: true,
    },
  },
};

export default nuxtConfig;
