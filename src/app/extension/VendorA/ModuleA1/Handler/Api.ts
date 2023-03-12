import 'reflect-metadata' // Must have
import Server from '~Http/Server'
import { getRestApi } from '~Autoload'

// Autoload api from Api/Rest
export default Server(getRestApi(__dirname))
