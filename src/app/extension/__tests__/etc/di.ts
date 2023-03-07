import 'reflect-metadata' // Must have
import { container } from 'tsyringe'
import ResourceConnection from '../../../core/ResourceModel/ResourceConnection'
import TestResourceModel from '../Model/ResourceModel/Test'

container.register('ResourceConnectionInterface', { useClass: ResourceConnection })
container.register('TestResourceModel', { useClass: TestResourceModel })
