import antfu from '@antfu/eslint-config';

export default antfu({
  rules: {
    'style/semi': ['error', 'always'],
    'antfu/if-newline': 'off',
  },
});
