import eslint from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['build/**', '.svelte-kit/**', '.netlify/**', 'node_modules/**'],
	},
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		// TypeScript already reports undefined identifiers.
		files: ['**/*.ts', '**/*.svelte'],
		rules: { 'no-undef': 'off' },
	},
	{
		// The app has no base path; filter links only change the query string.
		files: ['src/lib/components/Filters.svelte'],
		rules: { 'svelte/no-navigation-without-resolve': 'off' },
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
);
