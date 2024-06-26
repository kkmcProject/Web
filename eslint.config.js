export default [
  {
    extends: ["next/core-web-vitals", "airbnb", "airbnb-typescript"],
    rules: {
      "react/jsx-props-no-spreading": "off",
      "linebreak-style": 0,
      "import/no-extraneous-dependencies": [
        "error",
        {
          devDependencies: true,
          optionalDependencies: true,
          peerDependencies: false,
        },
      ],
      "import/prefer-default-export": ["off", { target: "single" }],
      "operator-linebreak": [0],
    },
  },
];
