export interface PageInfo {
    nextPageUrl?: string | null;
    previousPageUrl?: string | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    /** @deprecated Use nextPageUrl instead. Retained for backward compatibility during rollout. */
    nextCursor?: string | null;
    /** @deprecated Use previousPageUrl instead. Retained for backward compatibility during rollout. */
    prevCursor?: string | null;
}

export interface ListResponse<T> {
    data: T[];
    pageInfo: PageInfo;
}
