import 'reflect-metadata' // Must have
import { inject, injectable } from 'tsyringe'
import { Schema } from 'dynamoose/dist/Schema'
import { ResourceConnectionInterface } from './ResourceConnection'

/**
 * Ref: \Magento\Framework\Model\ResourceModel\Db\AbstractDb
 */
@injectable()
export default class AbstractDb {
    /**
     * @var string
     */
    protected mainTable: string = ''

    /**
     * @var Schema
     */
    protected schema: Schema | null = null

    /**
     * Constructor
     */
    constructor(@inject('ResourceConnectionInterface') private resource: ResourceConnectionInterface) {}

    /**
     * Get connection
     */
    public getConnection() {
        return this.resource.getConnection()
    }

    /**
     * Get Model
     */
    protected getModel() {
        if (!this.schema) {
            throw new Error('No schema found with model ' + this.mainTable)
        }
        return this.getConnection().model(this.mainTable, this.schema, {
            create: false,
        })
    }

    /**
     * Insert Or Update
     *
     * @param body
     */
    public async insertOrUpdate(body: any) {
        const record = new (this.getModel())(body)
        await record.save()
        return record
    }
}
