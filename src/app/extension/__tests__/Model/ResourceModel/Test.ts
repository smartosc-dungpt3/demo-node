import 'reflect-metadata' // Must have
import AbstractDb from '../../../../core/ResourceModel/AbstractDb'
import * as dynamoose from 'dynamoose'
import { injectable, singleton } from 'tsyringe'

@singleton()
@injectable()
export default class TestResourceModel extends AbstractDb {
    mainTable = 'tbl_test'

    schema = new dynamoose.Schema(
        {
            entity_id: { type: Number, hashKey: true },
            name: String,
        },
        {
            saveUnknown: true,
            timestamps: {
                createdAt: 'created_at',
                updatedAt: 'updated_at',
            },
        }
    )
}
