const { exec } = require('child_process')
exec('node -v', (err, stdout) => {
    if (err) throw err
    if (stdout < 'v18') {
        throw new Error(`This repository need node version >= v18 but you have ${stdout}`)
    }
})
