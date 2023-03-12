import 'reflect-metadata' // Must have
import { injectable, singleton } from 'tsyringe'
import * as dynamoose from 'dynamoose'
require('dotenv').config()

export interface ResourceConnectionInterface {
    getConnection(): typeof dynamoose
}

/**
 * Ref: \Magento\Framework\App\ResourceConnection
 */
@singleton()
@injectable()
export default class ResourceConnection implements ResourceConnectionInterface {
    /**
     * Instances of actual connections.
     */
    protected connection: typeof dynamoose | null = null

    /**
     * Retrieve connection to resource specified by $resourceName.
     */
    public getConnection(): typeof dynamoose {
        if (this.connection) {
            return this.connection
        }

        // Create new DynamoDB instance, auto load the configuration from .env:
        // AWS_ACCESS_KEY_ID
        // AWS_SECRET_ACCESS_KEY
        // AWS_REGION
        const ddb = new dynamoose.aws.ddb.DynamoDB({})

        // Set DynamoDB instance to the Dynamoose DDB instance
        dynamoose.aws.ddb.set(ddb)

        // Set DynamoDB endpoint
        if (process.env.AWS_DYNAMO_ENDPOINT) {
            dynamoose.aws.ddb.local(process.env.AWS_DYNAMO_ENDPOINT)
        }

        this.connection = dynamoose
        return dynamoose
    }
}
