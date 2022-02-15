module.exports = {
  apps: [
    {
      name: 'GR-Slack-app',
      script: './index.js',
      watch: ['lib', 'modules', './index.js'],
      watch_delay: 1000,
      ignore_watch: ['node_modules']
    }
  ]
}
