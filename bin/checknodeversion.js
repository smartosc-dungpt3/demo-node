const { exec } = require('child_process')
const chalk = require('chalk')
exec('node -v', (err, stdout) => {
    if (err) throw err
    if (stdout < 'v18') {
        throw new Error(chalk.red(`This repository need node version >= v18 but you have ${stdout}`))
    }
})
