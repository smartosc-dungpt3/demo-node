import AbstractApi from '~Http/AbstractApi'
import { inject, injectable } from 'tsyringe'
import { GET } from '~Http/Decorators/HttpMethod'
import Route from '~Http/Decorators/Route'
import TodoModel, { TodoInterface } from '~VendorA_ModuleA1/Model/Todo'
import { Request } from 'express-serve-static-core'

@GET
@Route('/todo/:task_name')
@injectable()
export default class GetTodo extends AbstractApi {
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
        const data = await this.todoModel.getTodo(req.params.task_name)
        return {
            data,
        }
    }
}
