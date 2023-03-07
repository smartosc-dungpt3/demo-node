import 'reflect-metadata' // Must have
import { singleton, container } from 'tsyringe'

@singleton()
class User {
    name: string = ''
    setName(value: string) {
        this.name = value
    }
    getName() {
        return 'Hello ' + this.name
    }
}

it('Test singleton pattern', () => {
    const userA = container.resolve(User)
    userA.setName('Bob')
    expect(userA.getName()).toBe('Hello Bob')

    // Get object again
    const userB = container.resolve(User)
    expect(userB.getName()).toBe('Hello Bob')
})
