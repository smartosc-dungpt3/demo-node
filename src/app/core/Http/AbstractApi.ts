import express from 'express'
import { ApiResponseInterface } from '@Http/Types'

export default abstract class AbstractApi {
    abstract execute(req: any): Promise<ApiResponseInterface>

    async fetch(req: any): Promise<ApiResponseInterface> {
        try {
            const response = await this.execute(req)

            response.success = !response.error
            if (response?.error && !response?.error?.code) {
                response.error.code = 500
            }

            if (response.success) {
                delete response.error
            }

            return response
        } catch (e: any) {
            return {
                success: false,
                error: {
                    code: 500,
                    message: e?.message,
                },
            }
        }
    }

    renderRoute() {
        // @ts-ignore
        if (!this.route) {
            console.error('Please define a route!')
            return null
        }

        const router = express.Router()

        // @ts-ignore
        const httpMethod = this.httpMethod || 'get'
        // @ts-ignore
        const validator = this.validator || undefined

        // @ts-ignore
        router.route(this.route)[httpMethod](async (req, res) => {
            const response = await this.fetch(req)
            return res.status(+(response?.error?.code || 200)).json(response)
        })

        return router
    }
}
