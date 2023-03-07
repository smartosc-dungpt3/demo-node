import 'reflect-metadata' // Must have
import AbstractModel from '../../../core/Model/AbstractModel'
import { inject, injectable } from 'tsyringe'
import TestResourceModel from './ResourceModel/Test'

@injectable()
export default class TestModel extends AbstractModel {
    /**
     * Constructor
     */
    constructor(@inject('TestResourceModel') private resourceModel: TestResourceModel) {
        super()
    }

    /**
     * Add Record
     *
     * @param body
     */
    public async addOrUpdateRecord(body: object) {
        await this.resourceModel.insertOrUpdate(body)
    }
}
