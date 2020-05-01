module.exports = {
  plugins: [
    require('postcss-for'),
    require('postcss-each'),
    require('postcss-preset-env')({ stage: 0 }),
    require('postcss-import'),
    require('postcss-nested'),
    require('postcss-css-variables'),
    require('postcss-automath'),
    require('postcss-url')({ url: 'inline' }),
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
