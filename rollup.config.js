import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

const production = !process.env.ROLLUP_WATCH;

export default [
  // ESM build
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.mjs',
      format: 'es',
      sourcemap: true
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist'
      }),
      production && terser({
        compress: {
          drop_console: true,
          passes: 2
        },
        mangle: {
          properties: {
            regex: /^_/
          }
        }
      })
    ].filter(Boolean),
    external: []
  },
  
  // CommonJS build  
  {
    input: 'src/index.ts',
    output: {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    plugins: [
      typescript({
        tsconfig: './tsconfig.json'
      }),
      production && terser({
        compress: {
          drop_console: true,
          passes: 2
        },
        mangle: {
          properties: {
            regex: /^_/
          }
        }
      })
    ].filter(Boolean),
    external: []
  }
];