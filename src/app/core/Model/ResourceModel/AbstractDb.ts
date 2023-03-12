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
     * @param body
     */
    public async insert(body: any) {
        return await this.getModel().create(body)
    }

    /**
     * @param key
     */
    public async getByKey<T>(key: string | number): Promise<T> {
        const result = await this.getModel().get(key)
        if (result) {
            return result as T
        }
        throw new Error('Item not Found!')
    }

    /**
     * @param body
     */
    public async update(body: any) {
        return await this.getModel().update(body)
    }

    /**
     * @param key
     */
    public async deleteByKey(key: string | number) {
        return await this.getModel().delete(key)
    }

    /**
     * Scan all items with no filters or options
     */
    public async scan() {
        return await this.getModel().scan().exec()
    }
}
