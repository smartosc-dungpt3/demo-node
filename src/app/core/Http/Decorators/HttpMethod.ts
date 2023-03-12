import { HttpMethodType } from '@Http/Types'

export function GET(target: Function) {
    target.prototype.httpMethod = 'get' as HttpMethodType
}

export function POST(target: Function) {
    target.prototype.httpMethod = 'post' as HttpMethodType
}

export function PUT() {
    return function (target: any) {
        target.prototype.httpMethod = 'put' as HttpMethodType
    }
}

export function DELETE() {
    return function (target: any) {
        target.prototype.httpMethod = 'delete' as HttpMethodType
    }
}

export function PATCH() {
    return function (target: any) {
        target.prototype.httpMethod = 'patch' as HttpMethodType
    }
}

export function HEAD() {
    return function (target: any) {
        target.prototype.httpMethod = 'head' as HttpMethodType
    }
}

export function OPTIONS() {
    return function (target: any) {
        target.prototype.httpMethod = 'options' as HttpMethodType
    }
}
