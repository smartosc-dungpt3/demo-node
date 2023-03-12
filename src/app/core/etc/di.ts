import { container } from 'tsyringe'
import ResourceConnection from '~Model/ResourceModel/ResourceConnection'

container.register('ResourceConnectionInterface', { useClass: ResourceConnection })
