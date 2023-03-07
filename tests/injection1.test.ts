import 'reflect-metadata' // Must have
import { container } from 'tsyringe'

it('Test dependency injection 1 - with value provider', () => {
    container.register('Text', { useValue: 'Hi' })

    const res = container.resolve('Text')
    expect(res).toBe('Hi')
})
