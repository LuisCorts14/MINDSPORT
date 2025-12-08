const { override } = require('customize-cra');

module.exports = override(
  (config) => {
    // Configurar webpack para UTF-8
    config.module.rules.forEach(rule => {
      if (rule.oneOf) {
        rule.oneOf.forEach(oneOf => {
          if (oneOf.test && oneOf.test.toString().includes('js')) {
            oneOf.options = oneOf.options || {};
            oneOf.options.sourceType = 'unambiguous';
          }
        });
      }
    });

    // Asegurar que todos los loaders usen UTF-8
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', { modules: false }],
            ['@babel/preset-react', { runtime: 'automatic' }]
          ],
          sourceType: 'unambiguous'
        }
      }
    });

    return config;
  }
);