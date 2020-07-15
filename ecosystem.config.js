module.exports = {
  apps: [
    {
      interpreter: './node_modules/.bin/ts-node',
      interpreter_args: '-P tsconfig.json',
      cwd: './',
      name: 'zhi-hu',
      script: './app/index.ts',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
      ignore_watch: ['node_modules'],
      watch: false,
    },
  ],
}
