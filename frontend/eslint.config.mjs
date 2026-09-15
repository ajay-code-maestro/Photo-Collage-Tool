import js from "@eslint/js";

export default [
  {
    ignores: [
      "**/dist/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "**/node_modules/**"
    ]
  },
  js.configs.recommended
];
