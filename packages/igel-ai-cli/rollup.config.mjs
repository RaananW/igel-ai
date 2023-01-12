import typescript from "@rollup/plugin-typescript";
import copy from "@guanghechen/rollup-plugin-copy";

export default [
    {
        input: "src/cliInterface.ts",
        output: {
            file: "bin/cliInterface.mjs",
            format: "esm",
            sourcemap: true,
        },
        plugins: [
            typescript({ sourceMap: true, inlineSources: true }),
            copy({
                targets: [{ src: "src/cli.mjs", dest: "bin" }],
            }),
        ],
    },
];
