import fs from 'fs'
import path from 'path'
import { container } from 'tsyringe'
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

// Cached containers
let DI_COMPILED: DependencyContainer

// Autoload containers
export const getContainer = (): DependencyContainer => {
    if (DI_COMPILED) {
        return DI_COMPILED
    }

    const workDir = path.join(__dirname, '/')
    const files = getAllFiles(workDir)

    for (const file of files) {
        const route = path.parse(file)
        const dirs = route.dir.split('/')
        if (route.base === 'di.ts' && dirs[dirs.length - 1] === 'etc') {
            require(route.dir + '/' + route.base)
        }
    }
    DI_COMPILED = container
    return DI_COMPILED
}
