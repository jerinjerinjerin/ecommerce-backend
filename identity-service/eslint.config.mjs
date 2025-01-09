import globals from "globals";
import pluginJs from "@eslint/js";
import tseslintPlugin from "@typescript-eslint/eslint-plugin";
import tseslintParser from "@typescript-eslint/parser";
import jest from "eslint-plugin-jest";
import prettier from "eslint-plugin-prettier";


export default [
  {
    ignores: ["dist/"], 
  },
  {
    files: ["src/**/*.{js,ts,jsx,tsx}", "tests/**/*.{js,ts,jsx,tsx}"], // Target source and test files
    languageOptions: {
      parser: tseslintParser, 
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true, 
        },
      },
      globals: globals.node, 
    },
    plugins: {
      "@typescript-eslint": tseslintPlugin,
      prettier, 
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslintPlugin.configs.recommended.rules,
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto", 
        },
      ],
    },
  },
  {
    files: ["tests/**/*.{js,ts,jsx,tsx}"], 
    ...jest.configs["flat/recommended"],
    rules: {
      ...jest.configs["flat/recommended"].rules,
      "jest/prefer-expect-assertions": "off", 
    },
  },
  
];
