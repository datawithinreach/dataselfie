const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
const srcDir = 'src';
const tgtDir = 'dist';
const srcFullPath = path.join(__dirname, srcDir);
const tgtFullPath = path.join(__dirname, tgtDir);
console.log(webpack.SplitChunksPlugin);
module.exports = {
	mode: 'development',
	entry: {
		polyfill: ['babel-polyfill'],
		module: path.join(srcFullPath, 'index.jsx')
	},
	devtool: 'eval-source-map',// for production, refer to https://webpack.js.org/configuration/devtool/
	devServer:{
		contentBase: tgtDir,
		port: 8888,
		host: '0.0.0.0',
		historyApiFallback: true,
		hot:false,
		inline:false
		// ,
		// public: 'www.namwkim.org:8888'
	},
	resolve: {
		modules: [srcFullPath, 'node_modules'], //resolved to ./
		extensions:['.js', '.jsx']
	},
	output: {
		path: tgtFullPath, // Path to where webpack will build stuffs
		publicPath: '/', // This is used to generate URLs to e.g. images
		filename: '[name].js' // This is used to name bundled files from entry points.
	},
	module: {
		rules: [{
			test:/\.(js|jsx)$/,
			enforce: 'pre',
			loader: 'eslint-loader',
			include: srcFullPath,
			options: {
				failOnWarning: false,
				failOnError: true,
				fix: true
			}
		},
		{
			test: /\.(js|jsx)$/,///\.js?$/,
			// exclude: /node_modules/,
			include: srcFullPath,
			loader: 'babel-loader',
			options: {
				plugins: ['transform-runtime','transform-object-rest-spread'],
				presets: ['react', 'env'] //['env'],stage-0 es7 support? async etc
			}
		},
		// {
		// 	test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		// 	loader: 'url-loader?limit=10000&mimetype=application/font-woff'
		// },
		// {
		// 	test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
		// 	loader: 'file-loader?outputPath=assets/files/'
		// },
		{
			test: /\.css$/,
			use: [
				MiniCssExtractPlugin.loader,
				{
					loader:'css-loader',
					options:{
						modules: true,
						localIdentName: '[local]--[hash:base64:7]'
					}
				}
			]

		}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: './css/[name].css',
			chunkFilename: './css/[id].css'
		}),
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: 'vendor',
		// 	minChunks: function (module) {
		// 		// this assumes your vendor imports exist in the node_modules directory
		// 		return module.context && module.context.indexOf('node_modules') !== -1;
		// 	}
		// }),
		//CommonChunksPlugin will now extract all the common modules from vendor and main bundles
		// new webpack.optimize.CommonsChunkPlugin({
		// 	name: 'manifest' //But since there are no more common modules between them we end up with just the runtime code included in the manifest file
		// }),
		// new ExtractTextPlugin('./css/[name].css'),

		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.join(__dirname, 'src/index.html')
		}),
		new CopyWebpackPlugin([
			{
				from: 'src/assets',
				to: 'assets',
				force: true
			}]
		),
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.LoaderOptionsPlugin({
			debug: true
		})
	]
};
