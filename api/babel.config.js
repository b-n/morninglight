module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-env',
      {
        'modules': false,
        targets: {
          node: '8.10',
        },
      },
    ],
  ],
}
