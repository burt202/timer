import eslintJs from "@eslint/js"
import globals from "globals"
import tsEslint from "typescript-eslint"
import pluginReact from "eslint-plugin-react"
import pluginReactHooks from "eslint-plugin-react-hooks"
import simpleImportSort from "eslint-plugin-simple-import-sort"
import importPlugin from "eslint-plugin-import"

export default [
  {
    ignores: ["build/", "eslint.config.mjs"],
  },
  {
    languageOptions: {
      parser: tsEslint.parser,
      ecmaVersion: 2023,
      sourceType: "script",
      parserOptions: {
        project: "./tsconfig.json",
      },
      globals: {...globals.browser, ...globals.node},
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  eslintJs.configs.recommended,
  ...tsEslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeChecked,
  importPlugin.flatConfigs.recommended,
  {
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      eqeqeq: "error",
      "object-shorthand": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
      "react/react-in-jsx-scope": "off",
      "simple-import-sort/imports": "error",
      "import/no-unresolved": "off",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
    },
  },
]
