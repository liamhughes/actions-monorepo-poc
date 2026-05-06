import { readdirSync } from 'fs';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import importX from 'eslint-plugin-import-x';

const noExtraneousDeps = (packageDir) => ({
  plugins: { 'import-x': importX },
  rules: {
    'import-x/no-extraneous-dependencies': ['error', { packageDir: ['.', packageDir] }],
  },
});

const packageOverrides = readdirSync('./packages').map((pkg) => ({
  files: [`packages/${pkg}/**`],
  ...noExtraneousDeps(`./packages/${pkg}`),
}));

export default tseslint.config(
  { ignores: ['**/dist/**'] },
  eslint.configs.recommended,
  tseslint.configs.recommended,
  prettier,
  ...packageOverrides,
);
