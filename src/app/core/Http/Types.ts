export type HttpMethodType = 'get' | 'post' | 'put' | 'delete' | 'patch' | 'options' | 'head'

export interface ApiResponseInterface<T = any> {
    success?: boolean
    data?: T
    error?: {
        code: number | string
        message: string
    }
}
