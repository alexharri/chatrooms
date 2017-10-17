// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module"
  },
  env: {
    browser: true,
  },
  extends: "airbnb-base",
  // required to lint *.vue files
  plugins: [
    "html"
  ],
  // check if imports actually resolve
  "settings": {
    "import/resolver": {
      "webpack": {
        "config": "build/webpack.base.conf.js"
      }
    }
  },
  // add your custom rules here
  "rules": {
    "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0,
    "quotes": [2, "double"],
    "no-console": 0,
    "prefer-template": 0,
    "key-spacing": 0,
    "no-multi-spaces": 0,
    "import/no-extraneous-dependencies": 0,
    "import/no-named-as-default": 0,
    "object-curly-newline": 0,
    "prefer-promise-reject-errors": 0,
    "no-param-reassign": 0,
    "function-paren-newline": 0,
    "linebreak-style": 0,
    "no-underscore-dangle": 0
  }
}
