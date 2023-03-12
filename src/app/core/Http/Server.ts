import express from 'express'
import serverless from 'serverless-http'
import BodyParser from 'body-parser'
import cors from 'cors'
import { ApiResponseInterface } from '@Http/Types'

export default (routes: any) => {
    const app = express()

    // Use body parser
    app.use(BodyParser.json())

    // Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
    // It shows the real origin IP in the heroku or Cloudwatch logs
    app.enable('trust proxy')

    // Enable Cross Origin Resource Sharing to all origins by default
    app.use(cors())

    // Transforms the raw string of req.body into json
    app.use(express.json())

    if (routes) {
        // Load API routes
        app.use('/api', routes)
    }

    // Catch 404
    app.use((req, res, next) => {
        const error: ApiResponseInterface = {
            success: false,
            error: {
                code: 404,
                message: 'Not Found',
            },
        }
        res.status(404).json(error)
        next(res)
    })

    return serverless(app)
}
