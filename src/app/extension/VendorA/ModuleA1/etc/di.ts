import { container } from 'tsyringe'
import TodoResourceModel from '~VendorA_ModuleA1/Model/ResourceModel/Todo'
import TodoModel from '~VendorA_ModuleA1/Model/Todo'

container.register('TodoResourceModel', { useClass: TodoResourceModel })
container.register('TodoModel', { useClass: TodoModel })
