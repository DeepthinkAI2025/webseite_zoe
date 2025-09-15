module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
  ],
  plugins: [
    'stylelint-order'
  ],
  rules: {
    'at-rule-no-unknown': [ true, {
      ignoreAtRules: ['tailwind', 'layer', 'apply', 'variants', 'responsive', 'screen']
    }],
    'order/properties-alphabetical-order': null,
    'no-empty-source': null,
  }
};
