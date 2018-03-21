module.exports = {
  siteMetadata: {
    title: 'freeCodeCamp Search | Learn To code and Help Non-profits',
    siteUrl: `https://learn.freecodecamp.org`,
    description: `Learn HTML, CSS and JavaScript with our free online course. Learn to build full stack JavaScript web applications with freeCodeCamp.`
  },
  plugins: [
    'gatsby-plugin-react-next',
    'gatsby-plugin-react-helmet',
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [
          'Lato\:400,400i,700'
        ]
      }
    }
  ],
};
