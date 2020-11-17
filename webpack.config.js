var path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        main: ''
    },
    output: {
        filename: ''
    },
    module: {
        rules: [{
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
			{
				test: /\.(vs|fs|glsl)$/,
				exclude: /node_modules/,
				use: [
					'raw-loader',
					{
						loader: 'glslify-loader',
						options: {
							transform: [
								['glslify-hex'],
								['glslify-import']
							],
							basedir: './src/glsl-chunks'
						}
					}
				]
			}
        ]
    },
    resolve: {
		extensions: [".ts", ".js"],
		alias: {
			"@OrayTracingRenderer": path.resolve(__dirname, 'src/ts/libs/OrayTracingRenderer/src'),
            "@ore-three-ts": path.resolve(__dirname, 'src/ts/libs/ore-three-ts/src')
        },
    }
};