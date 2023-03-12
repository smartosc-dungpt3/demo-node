import AbstractApi from '@Http/AbstractApi'
import { inject, injectable } from 'tsyringe'
import { GET } from '@Http/Decorators/HttpMethod'
import Route from '@Http/Decorators/Route'
import TodoModel from '@VendorA_ModuleA1/Model/Todo'

@GET
@Route('/todo')
@injectable()
export default class GetAllTodo extends AbstractApi {
    /**
     * Constructor
     */
    constructor(@inject('TodoModel') private todoModel: TodoModel) {
        super()
    }

    /**
     * Execute
     */
    async execute() {
        const data = await this.todoModel.getAllTodo()
        return {
            data,
        }
    }
}
