import 'reflect-metadata' // Must have
import TestModel from './Model/Test'
import { getContainer } from '../../Autoload'

it('Test Model, Resource Model', () => {
    const modelA = getContainer().resolve(TestModel)
    modelA.addOrUpdateRecord({
        entity_id: 1,
        name: 'Alice',
        age: 18
    })

    const modelB = getContainer().resolve(TestModel)
    modelB.addOrUpdateRecord({
        entity_id: 2,
        name: 'Bob',
        age: 26
    })
})
