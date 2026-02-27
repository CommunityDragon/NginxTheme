import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import { nginxIndex } from './plugins/nginx-index';
import { createHtmlPlugin } from 'vite-plugin-html';
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

export default defineConfig(({ command }) => ({
    base: command === 'build' ? '/.theme/' : '/',
    plugins: [
        tsconfigPaths(),
        preact({
            
            prerender: {
                enabled: true,
                renderTarget: '#app',
            },
        }),
        tailwindcss(),
        createHtmlPlugin({
            minify: {
                removeComments: false,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        nginxIndex({
            removeIndex: true, // process.env.REMOVE_INDEX === 'true'
        }),
    ],
    resolve: {
        alias: {
            "react": 'preact/compat',
            'react-dom': 'preact/compat',
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        watch: {
            ignored: [
                '**/.history/**'
            ]
        }
    }
}));
