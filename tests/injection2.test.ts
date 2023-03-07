import 'reflect-metadata' // Must have
import { container, injectable, inject } from 'tsyringe'

interface UserInterface {
    name: string
    setName(value: string): void
    getName(): string
}

class UserService implements UserInterface {
    name: string = ''
    setName(value: string) {
        this.name = value
    }
    getName() {
        return 'Hello ' + this.name
    }
}

@injectable()
export class Client {
    constructor(@inject('UserInterface') private user: UserInterface) {}

    setUser(name: string) {
        this.user.setName(name)
    }

    getUser() {
        return this.user.getName()
    }
}

it('Test dependency injection 2 - with class provider (interface)', () => {
    container.register('UserInterface', { useClass: UserService })

    const clientA = container.resolve(Client)
    clientA.setUser('Alice')
    expect(clientA.getUser()).toBe('Hello Alice')

    const clientB = container.resolve(Client)
    expect(clientB.getUser()).toBe('Hello ')

    expect(clientA).not.toBe(clientB)
})
