module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        tsconfigRootDir: __dirname,
        project: [
            "./tsconfig.eslint.json",
            "./packages/**/tsconfig.json",
            ,
            "./packages/**/tsconfig.node.json",
        ],
    },
    rules: {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn", // or "error"
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
    },
    plugins: ["@typescript-eslint"],
    root: true,
};
