const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    //entry point
    entry: "./src/js/index.js",
    output: {
        //has to be absolute path 
        path: path.resolve(__dirname, './dist'),
        filename: 'js/bundle.js'
    },
    //can be set up by webpack-cli，(webpack --mode development)
    //mode: 'development'

    // path which you want to be served
    devServer: {
        contentBase: './dist'
    },

    //copy html to dist, it also can generate a html file
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
        })
    ]
}