'use strict'
const fs = require('fs')
const YAML = require('yamljs')
const path = require('path')
const chalk = require('chalk')

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

module.exports = sls => {
    // Autoload files
    const workDir = path.join(__dirname, './src/app')
    const files = getAllFiles(workDir)

    // Filter resources
    const routes = []
    for (const file of files) {
        const route = path.parse(file)

        const dirs = route.dir.split('/')
        if (route.ext !== '.yml' || dirs[dirs.length - 1] !== 'Resources') {
            continue
        }
        routes.push(route)
    }

    const mapFiles = {}
    for (const r of routes) {
        mapFiles[r.dir + '/' + r.base] = fs.readFileSync(r.dir + '/' + r.base, 'utf8')
    }

    const resources = Object.keys(mapFiles)
        .map(dir => YAML.parse(mapFiles[dir]))
        .reduce((result, handler) => Object.assign(result, handler), {})

    if (resources?.DYNAMOEXECUTIONROLE) {
        let tblResource = []
        Object.keys(resources).forEach(name => {
            if (resources[name].Type === 'AWS::DynamoDB::Table') {
                tblResource = tblResource.concat([
                    { 'Fn::GetAtt': [name, 'Arn'] },
                    { 'Fn::Join': ['/', [{ 'Fn::GetAtt': [name, 'Arn'] }, 'index/*']] },
                ])
            }
        })
        if (tblResource.length) {
            resources.DYNAMOEXECUTIONROLE.Properties.Policies[0].PolicyDocument.Statement[0].Resource = tblResource
        }
    }

    console.log('Resources:', chalk.magenta(JSON.stringify(resources)))
    return resources
}
