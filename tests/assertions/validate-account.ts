import type { IAccount } from '@interfaces/models'

export default (account: IAccount): void => {
    expect(account).toHaveProperty('id')
    expect(account).toHaveProperty('first_name')
    expect(account).toHaveProperty('middle_name')
    expect(account).toHaveProperty('last_name')
    expect(account).toHaveProperty('contact_number')
    expect(account).toHaveProperty('email_address')
    expect(account).toHaveProperty('username')
    expect(account).toHaveProperty('password')
    expect(account).toHaveProperty('created_at')
    expect(account).toHaveProperty('updated_at')
}
