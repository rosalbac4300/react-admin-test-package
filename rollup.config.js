import resolve, { nodeResolve } from '@rollup/plugin-node-resolve'
import image from '@rollup/plugin-image'
import commonjs from '@rollup/plugin-commonjs'
import typescript from '@rollup/plugin-typescript'
import json from '@rollup/plugin-json'
import dts from 'rollup-plugin-dts'
import css from 'rollup-plugin-import-css'

const packageJson = require('./package.json')

export default [
    {
        input: "src/index.ts",
        output: [
            {
                file: packageJson.main,
                format: "cjs",  
                sourcemap: true
            },
            {
                file: packageJson.module,
                format: "esm",
                sourcemap: true
            }
        ],
        plugins: [
            resolve(),
            nodeResolve({
                browser: {
                  "fs": false,
                  "path": false,
                  "os": false,
                  "stream": false,
                  "http": false,
                  "tls": false,
                  "zlib": false,
                  "https": false,
                  "net": false,
                  "tty": false,
                  "url": false,
                  "assert": false
                }
            }),
            commonjs(),
            typescript({tsconfig: './tsconfig.json'}),
            json(),
            image(),
            css()
        ],
    }, 
    {
        input: "dist/esm/types/index.d.ts",
        output: [{ file: "dist/index.d.ts", format: "esm"}],
        plugins: [dts()],
    },
]