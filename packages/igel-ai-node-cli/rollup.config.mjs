import typescript from "@rollup/plugin-typescript";

export default [
    {
        input: "src/cliInterface.ts",
        output: {
            file: "dist/cliInterface.mjs",
            format: "esm",
            sourcemap: true,
        },
        plugins: [typescript({ sourceMap: true, inlineSources: true })],
    },
];
