export interface IEvent {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pathParameters: IPathParameters,
}

interface IPathParameters {
    id: string,
}
