import 'reflect-metadata' // Must have
import fs from 'fs'
import path from 'path'
import { container } from 'tsyringe'
import express from 'express'
import DependencyContainer from 'tsyringe/dist/typings/types/dependency-container'

// Read directory recursive
function* getAllFiles(dir: string): any {
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

function getModuleNameFromModulePath(modulePath: string) {
    const arr = modulePath.split('/')
    return arr.slice(arr.length - 3, arr.length - 1).join('_')
}

// Cached containers
let DI_COMPILED: DependencyContainer

// Autoload containers
export const getContainer = (): DependencyContainer => {
    if (DI_COMPILED) {
        return DI_COMPILED
    }

    const workDir = path.join(__dirname, '/')
    const files = getAllFiles(workDir)
    const DILoaded = []

    for (const file of files) {
        const route = path.parse(file)
        const dirs = route.dir.split('/')
        if (['di.ts', 'di.js'].includes(route.base) && dirs[dirs.length - 1] === 'etc') {
            require(route.dir + '/' + route.base)
            DILoaded.push((route.dir + '/' + route.base).replace(workDir, ''))
        }
    }
    DI_COMPILED = container
    DILoaded.length && console.log('DI Loaded: ' + JSON.stringify(DILoaded))
    return DI_COMPILED
}

// Autoload rest apis
export const getRestApi = (dirname: string) => {
    const app = express()
    const container = getContainer()
    const workDir = path.join(dirname, '../Api/Rest')
    const files = getAllFiles(workDir)
    const RoutesLoaded = []

    for (const file of files) {
        const route = path.parse(file)
        const pathRoute = route.dir + '/' + route.base
        const apiClass = require(pathRoute)

        if (apiClass?.default) {
            const Class = apiClass.default
            container.register(pathRoute, { useClass: Class })
            const obj = container.resolve(pathRoute)

            // @ts-ignore
            const renderRoute = obj?.renderRoute()

            // @ts-ignore
            if (!!obj?.route && !!renderRoute) {
                // @ts-ignore
                app.use(renderRoute)
                // @ts-ignore
                RoutesLoaded.push(obj?.route)
            }
        }
    }

    const moduleName = getModuleNameFromModulePath(path.join(dirname, '../'))
    RoutesLoaded.length && console.log('Module:', moduleName, '| Route loaded:', JSON.stringify(RoutesLoaded))
    return app
}
