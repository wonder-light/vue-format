import { defineConfig } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

/** 覆盖默认的 tsconfig 配置 */
const tsconfigOverride = { compilerOptions: { module: 'ES2015' } };

export default defineConfig({
    input: './src/extension.ts',
    output: {
        dir: './dist',
        //entryFileNames: "main.js",
        sourcemap: false,
        exports: 'named',
        format: 'commonjs',
        intro: 'process.env.NODE_ENV = "production"',
    },
    cache: true,
    plugins: [typescript({ tsconfigOverride }), nodeResolve(), commonjs(),],
    //排除的外部依赖
    external: ['vscode'],
});