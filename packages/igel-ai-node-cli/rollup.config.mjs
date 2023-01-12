import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: "src/cli.ts",
        output: {
            file: "dist/cli.mjs",
            format: "esm",
            sourcemap: true,
        },
        plugins: [typescript({ sourceMap: true, inlineSources: true })],
    },
];
