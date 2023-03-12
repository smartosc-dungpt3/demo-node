export default function Route(route: string, validator: any = undefined) {
    return function (target: any) {
        target.prototype.route = route
        target.prototype.validator = validator
    }
}
