import type { IParameters } from '@features/create-account/parameters'
import type { IResponse } from '@features/create-account/response'
import type { IExecutable } from '@interfaces/executable'
import container from '@src/index'
import Types from '@src/types'
import account from '../account.json'

const createAccountScript = async (): Promise<void> => {
    try {
        const createAccount: IExecutable<IParameters, IResponse> = container.get(Types.CreateAccount)
        const createdAccount = await createAccount.execute(account)
        console.log('Successfully created an account', createdAccount)
        return Promise.resolve()
    } catch (error) {
        console.log('Encountered an error while creating an account', error)
        return Promise.reject(error)
    }
}

createAccountScript()
