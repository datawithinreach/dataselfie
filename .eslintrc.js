module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended", "plugin:react/recommended"
  ], //"eslint:recommended",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true
    }

  },
  "rules": {
    "process.env": ["off"],
    "indent": [
      "error", "tab"
    ],
    "linebreak-style": [
      "error", "unix"
    ],
    "quotes": [
      "error", "single"
    ],
    "semi": [
      "error", "always"
    ],
    "linebreak-style": 0,
    "no-console": 0
  },
  "plugins": ["react"]
};
