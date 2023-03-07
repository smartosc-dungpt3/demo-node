import 'reflect-metadata' // Must have
import { container, injectable, inject } from 'tsyringe'

class UserService {
    name: string = ''
    setName(value: string) {
        this.name = value
    }
    getName() {
        return 'Hi ' + this.name
    }
}

@injectable()
export class Client {
    constructor(@inject('UserService') private user: UserService) {}

    setUser(name: string) {
        this.user.setName(name)
    }

    getUser() {
        return this.user.getName()
    }
}

it('Test dependency injection 3 - with class provider (without interface)', () => {
    container.register('UserService', { useClass: UserService })

    const clientA = container.resolve(Client)
    clientA.setUser('Alice')
    expect(clientA.getUser()).toBe('Hi Alice')
})
