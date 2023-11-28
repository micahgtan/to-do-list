import type { IDuty } from '@interfaces/models'

export default (duty: IDuty): void => {
    expect(duty).toHaveProperty('id')
    expect(duty).toHaveProperty('account_id')
    expect(duty).toHaveProperty('name')
    expect(duty).toHaveProperty('created_at')
    expect(duty).toHaveProperty('updated_at')
}
