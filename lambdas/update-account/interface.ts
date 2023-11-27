export interface IEvent {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    pathParameters: IPathParameters,
    body: string,
}

interface IPathParameters {
    id: string,
}

export interface IBodyParameters {
    expected_start_time?: string,
    expected_end_time?: string,
    actual_start_time?: string,
    actual_end_time?: string,
}
