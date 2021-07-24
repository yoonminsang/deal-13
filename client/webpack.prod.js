import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';

export default () => {
  merge(common, {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin(), // css 파일도 빈칸을 없애는 압축 (css-minimizer-webpack-plugin)도 유사
        new TerserPlugin({
          //  자바스크립트 코드를 난독화하고 debugger 구문을 제거
          terserOptions: {
            compress: {
              drop_console: true, // 콘솔 로그를 제거한다
            },
          },
        }),
      ],
    },
  });
};
