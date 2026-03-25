export interface PageInfo {
    nextCursor: string | null;
    prevCursor: string | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ListResponse<T> {
    data: T[];
    pageInfo: PageInfo;
}
