var path = require('path');

module.exports = {
    // 入口
    entry: {
        index: './index.js',
        user: './user.js',
        bug: './bug.js'
    },
    // 输出
    output: {
        path: path.join(__dirname, '../javascripts/'),
        filename: '[name].js',
        chunkFilename: 'chunk/[chunkhash:8].chunk.js',
        publicPath: '/'
    },
    module: {
        // 加载器
        loaders: [
            { test: /\.vue$/, loader: 'vue' },
            { test: /\.css$/, loader: 'style!css!postcss-loader'},
            { test: /\.js$/, loader: 'babel', exclude: /node_modules|vue\/dist|vue-router\/|vue-loader\/|vue-hot-reload-api\// },
            { test: /\.(png|jpg|gif)$/, loader: 'url-loader', query: {limit: 10000, name: '[name].[ext]?[hash]'}},
            { test: /\.(html|tpl)$/, loader: 'html-loader' },
        ]
    },
    resolveLoader: {
        root: path.join(__dirname, 'node_modules')
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    },
    resolve: {
        modulesDirectories: ['node_modules', 'my_modules'],
        // require时省略的扩展名，如：require('module') 不需要module.js
        extensions: ['', '.js', '.vue'],
        // 别名
        alias: {
            components: path.join(__dirname, './components')
        }
    }
    // ,
    // 开启source-map，webpack有多种source-map，在官网文档可以查到
    // devtool: '#source-map'
};