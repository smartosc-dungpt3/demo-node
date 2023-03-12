import 'reflect-metadata' // Must have
import { injectable, singleton } from 'tsyringe'
import AbstractDb from '~Model/ResourceModel/AbstractDb'
import * as dynamoose from 'dynamoose'

@singleton()
@injectable()
export default class TodoResourceModel extends AbstractDb {
    mainTable = 'tbl_todo'

    schema = new dynamoose.Schema(
        {
            task_name: { type: String, hashKey: true },
            is_completed: Boolean,
        },
        {
            saveUnknown: true,
        }
    )
}
