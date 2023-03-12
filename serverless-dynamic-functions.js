'use strict'
const fs = require('fs')
const YAML = require('yamljs')
const path = require('path')

// Read directory recursive
function* getAllFiles(dir) {
    const dirents = fs.readdirSync(dir, { withFileTypes: true })
    for (const dirent of dirents) {
        const res = path.resolve(dir, dirent.name)
        if (dirent.isDirectory()) {
            yield* getAllFiles(res)
        } else {
            yield res
        }
    }
}

module.exports = () => {
    // Autoload files
    const workDir = path.join(__dirname, './src/app')
    const files = getAllFiles(workDir)

    // Filter by functions.yml
    const routes = []
    for (const file of files) {
        const route = path.parse(file)
        if (route.base !== 'functions.yml') {
            continue
        }
        routes.push(route)
    }

    const mapFiles = {}
    for (const r of routes) {
        mapFiles[r.dir] = fs.readFileSync(r.dir + '/' + r.base, 'utf8')
    }

    const functions = Object.keys(mapFiles)
        .map(dir => {
            const yml = YAML.parse(mapFiles[dir])

            // Auto load handlers
            Object.keys(yml).forEach(functionName => {
                const handlerFileName = yml[functionName].handler
                let actualHandler = dir + '/Handler/' + handlerFileName
                actualHandler = actualHandler.replace(__dirname + '/', '')
                if (actualHandler.slice(0, 'src/'.length) === 'src/') {
                    actualHandler = actualHandler.substring('src/'.length)
                    actualHandler = 'dist/' + actualHandler
                }
                yml[functionName].handler = actualHandler + '.default'
            })
            return yml
        })
        .reduce((result, handler) => Object.assign(result, handler), {})

    console.log('Functions: ', functions)
    return functions
}
