import AbstractApi from '@Http/AbstractApi'
import { Request } from 'express-serve-static-core'
import { inject, injectable } from 'tsyringe'
import { PUT } from '@Http/Decorators/HttpMethod'
import Route from '@Http/Decorators/Route'
import TodoModel, { TodoInterface } from '@VendorA_ModuleA1/Model/Todo'

@PUT
@Route('/todo/complete')
@injectable()
export default class CompleteTodo extends AbstractApi {
    /**
     * Constructor
     */
    constructor(@inject('TodoModel') private todoModel: TodoModel) {
        super()
    }

    /**
     * Execute
     */
    async execute(req: Request<TodoInterface>) {
        const data = await this.todoModel.completeTodo(req.body.task_name)
        return {
            data,
        }
    }
}
