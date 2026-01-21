import js from '@eslint/js'
import tanstackQuery from '@tanstack/eslint-plugin-query'
import eslintConfigPrettier from 'eslint-config-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      tanstackQuery.configs['flat/recommended'],
      eslintConfigPrettier,
    ],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/naming-convention': [
        'error',
        // 기본: camelCase
        {
          selector: 'default',
          format: ['camelCase'],
        },
        // 변수: camelCase, UPPER_CASE (상수), PascalCase (컴포넌트)
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        // 함수: camelCase, PascalCase (컴포넌트)
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // 타입/인터페이스: PascalCase
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        // 타입 프로퍼티: 환경 변수 등을 위해 UPPER_CASE 허용
        {
          selector: 'typeProperty',
          format: ['camelCase', 'UPPER_CASE'],
        },
        // import: 모든 형식 허용
        {
          selector: 'import',
          format: null,
        },
        // 객체 속성: 외부 API 응답 등을 위해 유연하게
        {
          selector: 'objectLiteralProperty',
          format: null,
        },
        // 객체 메서드: endpoints 상수 등에서 UPPER_CASE 허용
        {
          selector: 'objectLiteralMethod',
          format: ['camelCase', 'UPPER_CASE'],
        },
        // 구조 분해 변수: 외부 라이브러리 호환
        {
          selector: 'variable',
          modifiers: ['destructured'],
          format: null,
        },
      ],
    },
  },
])
