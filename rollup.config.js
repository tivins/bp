import typescript from "@rollup/plugin-typescript";

export default {
    input: "examples/IconExample.ts",
    watch: {
        include: ['src/**', 'examples/**'],
        exclude: 'node_modules/**'
    },
    output: {
        file: "dist/bundle.js",
        format: "umd",
        name: "bp"
    },
    plugins: [typescript()]
};
