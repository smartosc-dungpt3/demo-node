import { HttpMethodType } from '@Http/Types'

export function GET(target: Function) {
    target.prototype.httpMethod = 'get' as HttpMethodType
}

export function POST(target: Function) {
    target.prototype.httpMethod = 'post' as HttpMethodType
}

export function PUT(target: Function) {
    target.prototype.httpMethod = 'put' as HttpMethodType
}

export function DELETE(target: Function) {
    target.prototype.httpMethod = 'delete' as HttpMethodType
}

export function PATCH(target: Function) {
    target.prototype.httpMethod = 'patch' as HttpMethodType
}

export function HEAD(target: Function) {
    target.prototype.httpMethod = 'head' as HttpMethodType
}

export function OPTIONS(target: Function) {
    target.prototype.httpMethod = 'options' as HttpMethodType
}
