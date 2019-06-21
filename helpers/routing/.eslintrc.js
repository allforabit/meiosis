module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint"
  ],
  "parserOptions": {
    "ecmaVersion": 2018
  },
  "plugins": [
    "jest"
  ],
  "env": {
    "jest/globals": true
  },
  "rules": {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_"
      }
    ]
    /*
    "indent": "off",
    "@typescript-eslint/indent": ["error", 2]
    */
  }
}
