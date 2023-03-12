import AbstractApi from '~Http/AbstractApi'
import { Request } from 'express-serve-static-core'
import { inject, injectable } from 'tsyringe'
import { POST } from '~Http/Decorators/HttpMethod'
import Route from '~Http/Decorators/Route'
import TodoModel, { TodoInterface } from '~VendorA_ModuleA1/Model/Todo'

@POST
@Route('/todo')
@injectable()
export default class AddTodo extends AbstractApi {
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
        const data = await this.todoModel.newTodo({
            task_name: req.body.task_name,
        })
        return {
            data,
        }
    }
}
