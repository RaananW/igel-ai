import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: "src/core.ts",
        output: {
            file: "dist/core.js",
            format: "esm",
            sourcemap: true,
        },
        plugins: [typescript({ sourceMap: true, inlineSources: true })],
    },
    {
      input: "src/nodejs.ts",
      output: {
        file: "dist/nodejs.js",
        format: "esm",
            sourcemap: true,
        },
        plugins: [typescript({ sourceMap: true, inlineSources: true })],
    },
    {
        input: "src/web.ts",
        output: {
            file: "dist/web.js",
            format: "esm",
            sourcemap: true,
        },
        plugins: [typescript({ sourceMap: true, inlineSources: true })],
    },
];
