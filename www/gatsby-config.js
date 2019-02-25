module.exports = {
  siteMetadata: {
    title: 'freeCodeCamp Search | Learn To code and Help Non-profits',
    siteUrl: 'https://learn.freecodecamp.org',
    description:
      'Learn HTML, CSS and JavaScript with our free online course. Learn to ' +
      'build full stack JavaScript web applications with freeCodeCamp.',
    keywords: [
      'freeCodeCamp',
      'search',
      'lesson',
      'course',
      'guide',
      'youtube',
      'javascript',
      'node',
      'nodejs',
      'api',
      'server',
      'react',
      'redux',
      'bootstrap',
      'css',
      'sass',
      'scss',
      'html',
      'html5'
    ]
  },
  plugins: [
    'gatsby-plugin-react-next',
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-google-fonts',
      options: {
        fonts: [
          'Lato\:400,400i,700'
        ]
      }
    },
    {
      resolve: `gatsby-plugin-favicon`,
      options: {
        logo: "./src/favicon.png",
        injectHTML: true,
        icons: {
          android: true,
          appleIcon: true,
          appleStartup: true,
          coast: false,
          favicons: true,
          firefox: true,
          twitter: false,
          yandex: false,
          windows: false
        }
      }
    }
  ]
};
