import path from 'path';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
const __dirname = path.resolve();

export default () => {
  merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
      contentBase: path.resolve(__dirname + '/dist'),
      index: 'index.html',
      port: 9000,
      writeToDisk: true,
      hot: true,
      proxy: {
        '/api/': {
          // /api/로 시작하는 url은 아래의 전체 도메인을 추가하고, 옵션을 적용
          target: 'http://localhost:3000', // 클라이언트에서 api로 보내는 요청은 주소를 3000으로 변경
          changeOrigin: true, // cross origin 허용 설정
        },
      },
    },
  });
};
