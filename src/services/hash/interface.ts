export interface IHashServiceHashParameters {
    data: string | Buffer,
    salt_rounds: string | number,
}

export interface IHashServiceCompareParameters {
    data: string | Buffer,
    hash: string,
}

export interface IHashService {
    hash: (parameters: IHashServiceHashParameters) => Promise<string>,
    compare: (parameters: IHashServiceCompareParameters) => Promise<boolean>,
}
