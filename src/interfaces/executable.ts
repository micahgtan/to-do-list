export interface IExecutable<IParameters, IResponse> {
    execute: (parameters: IParameters) => IResponse,
}
