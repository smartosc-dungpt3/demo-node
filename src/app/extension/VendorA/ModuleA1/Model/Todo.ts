import 'reflect-metadata' // Must have
import { inject, injectable } from 'tsyringe'
import AbstractModel from '~Model/AbstractModel'
import TodoResourceModel from '~VendorA_ModuleA1/Model/ResourceModel/Todo'

export interface TodoInterface {
    task_name: string
    is_completed?: boolean
}

@injectable()
export default class TodoModel extends AbstractModel {
    /**
     * Constructor
     */
    constructor(@inject('TodoResourceModel') private resourceModel: TodoResourceModel) {
        super()
    }

    /**
     * @param item
     */
    public async newTodo(item: TodoInterface): Promise<TodoInterface> {
        item.is_completed = false
        await this.resourceModel.insert(item)
        return item
    }

    /**
     * @param task_name
     */
    public async getTodo(task_name: string): Promise<TodoInterface> {
        return await this.resourceModel.getByKey(task_name)
    }

    /**
     * Get all to do
     */
    public async getAllTodo() {
        return await this.resourceModel.scan()
    }

    /**
     * @param task_name
     */
    public async completeTodo(task_name: string) {
        const body: TodoInterface = { task_name, is_completed: true }
        await this.resourceModel.update(body)
    }

    /**
     * @param task_name
     */
    public async removeTodo(task_name: string) {
        await this.resourceModel.deleteByKey(task_name)
    }
}
