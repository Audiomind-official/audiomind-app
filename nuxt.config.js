const colors = require("vuetify/es5/util/colors").default;
const pt = require("vuetify/es5/locale/pt");

const { FRONTEND_PORT } = process.env;

module.exports = {
  server: {
    port: 3031,
  },
  mode: "universal",
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: "%s | Audiomind",
    title: process.env.npm_package_name || "",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || "",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: "#ED4B14" },

  rules: [
    // SASS has different line endings than SCSS
    // and cannot use semicolons in the markup
    {
      test: /\.sass$/,
      use: [
        "vue-style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          // Requires sass-loader@^7.0.0
          options: {
            // This is the path to your variables
            data: "@import '@/styles/variables.sass'",
          },
          // Requires sass-loader@^8.0.0
          options: {
            // This is the path to your variables
            prependData: "@import '@/styles/variables.sass'",
          },
        },
      ],
    },
    // SCSS has different line endings than SASS
    // and needs a semicolon after the import.
    {
      test: /\.scss$/,
      use: [
        "vue-style-loader",
        "css-loader",
        {
          loader: "sass-loader",
          // Requires sass-loader@^7.0.0
          options: {
            // This is the path to your variables
            data: "@import '@/styles/variables.scss';",
          },
          // Requires sass-loader@^8.0.0
          options: {
            // This is the path to your variables
            prependData: "@import '@/styles/variables.scss';",
          },
        },
      ],
    },
  ],

  /*
   ** Global CSS
   */
  css: ["assets/style.scss"],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ["~/plugins/axios"],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ["@nuxtjs/moment", "@nuxtjs/vuetify"],
  /*
   ** Nuxt.js modules
   */

  modules: ["@nuxtjs/axios"],

  axios: {
    baseURL: "https://api.audiomind.com.br/", //"http://localhost:3030"    //
  },

  moment: {
    defaultLocale: "pt",
    locales: ["pt"],
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    lang: {
      locales: { pt },
      current: "pt",
    },
    customVariables: ["~/assets/variables.scss"],
    theme: {
      themes: {
        light: {
          primary: "#3f51b5",
          secondary: "#b0bec5",
          accent: "#8c9eff",
          error: "#b71c1c",
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {},
  },
};
