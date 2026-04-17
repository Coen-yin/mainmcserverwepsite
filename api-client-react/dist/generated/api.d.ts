import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AdminDashboard, Announcement, AnnouncementListResponse, Appeal, AppealListResponse, ApplicationListResponse, Ban, BanListResponse, Changelog, ChangelogListResponse, CreateAnnouncementBody, CreateAppealBody, CreateApplicationBody, CreateBanBody, CreateChangelogBody, CreateForumCategoryBody, CreateGalleryImageBody, CreatePostBody, CreateRuleBody, CreateStoreItemBody, CreateThreadBody, CreateTicketBody, ForumCategory, ForumPost, ForumStats, ForumThread, ForumThreadDetail, GalleryImage, GetLeaderboardParams, HealthStatus, LeaderboardEntry, ListAnnouncementsParams, ListAppealsParams, ListApplicationsParams, ListBansParams, ListChangelogsParams, ListForumThreadsParams, ListTicketsParams, ListUsersParams, PromoteUserBody, RecordVoteBody, ReviewAppealBody, ReviewApplicationBody, Rule, ServerStats, ServerStatus, StaffApplication, StoreItem, SuccessResponse, ThreadListResponse, Ticket, TicketListResponse, UpdateProfileBody, UserListResponse, UserProfile, VerifyAdminBody, VerifyAdminResponse, VoteSiteListResponse } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get current user profile
 */
export declare const getGetMyProfileUrl: () => string;
export declare const getMyProfile: (options?: RequestInit) => Promise<UserProfile>;
export declare const getGetMyProfileQueryKey: () => readonly ["/api/users/profile"];
export declare const getGetMyProfileQueryOptions: <TData = Awaited<ReturnType<typeof getMyProfile>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getMyProfile>>>;
export type GetMyProfileQueryError = ErrorType<unknown>;
/**
 * @summary Get current user profile
 */
export declare function useGetMyProfile<TData = Awaited<ReturnType<typeof getMyProfile>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update current user profile
 */
export declare const getUpdateMyProfileUrl: () => string;
export declare const updateMyProfile: (updateProfileBody: UpdateProfileBody, options?: RequestInit) => Promise<UserProfile>;
export declare const getUpdateMyProfileMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
        data: BodyType<UpdateProfileBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
    data: BodyType<UpdateProfileBody>;
}, TContext>;
export type UpdateMyProfileMutationResult = NonNullable<Awaited<ReturnType<typeof updateMyProfile>>>;
export type UpdateMyProfileMutationBody = BodyType<UpdateProfileBody>;
export type UpdateMyProfileMutationError = ErrorType<unknown>;
/**
 * @summary Update current user profile
 */
export declare const useUpdateMyProfile: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
        data: BodyType<UpdateProfileBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateMyProfile>>, TError, {
    data: BodyType<UpdateProfileBody>;
}, TContext>;
/**
 * @summary List all users (admin)
 */
export declare const getListUsersUrl: (params?: ListUsersParams) => string;
export declare const listUsers: (params?: ListUsersParams, options?: RequestInit) => Promise<UserListResponse>;
export declare const getListUsersQueryKey: (params?: ListUsersParams) => readonly ["/api/users", ...ListUsersParams[]];
export declare const getListUsersQueryOptions: <TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(params?: ListUsersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListUsersQueryResult = NonNullable<Awaited<ReturnType<typeof listUsers>>>;
export type ListUsersQueryError = ErrorType<unknown>;
/**
 * @summary List all users (admin)
 */
export declare function useListUsers<TData = Awaited<ReturnType<typeof listUsers>>, TError = ErrorType<unknown>>(params?: ListUsersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listUsers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get user by ID
 */
export declare const getGetUserByIdUrl: (userId: string) => string;
export declare const getUserById: (userId: string, options?: RequestInit) => Promise<UserProfile>;
export declare const getGetUserByIdQueryKey: (userId: string) => readonly [`/api/users/${string}`];
export declare const getGetUserByIdQueryOptions: <TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<unknown>>(userId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetUserByIdQueryResult = NonNullable<Awaited<ReturnType<typeof getUserById>>>;
export type GetUserByIdQueryError = ErrorType<unknown>;
/**
 * @summary Get user by ID
 */
export declare function useGetUserById<TData = Awaited<ReturnType<typeof getUserById>>, TError = ErrorType<unknown>>(userId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getUserById>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Promote user to staff rank
 */
export declare const getPromoteUserUrl: (userId: string) => string;
export declare const promoteUser: (userId: string, promoteUserBody: PromoteUserBody, options?: RequestInit) => Promise<UserProfile>;
export declare const getPromoteUserMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof promoteUser>>, TError, {
        userId: string;
        data: BodyType<PromoteUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof promoteUser>>, TError, {
    userId: string;
    data: BodyType<PromoteUserBody>;
}, TContext>;
export type PromoteUserMutationResult = NonNullable<Awaited<ReturnType<typeof promoteUser>>>;
export type PromoteUserMutationBody = BodyType<PromoteUserBody>;
export type PromoteUserMutationError = ErrorType<unknown>;
/**
 * @summary Promote user to staff rank
 */
export declare const usePromoteUser: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof promoteUser>>, TError, {
        userId: string;
        data: BodyType<PromoteUserBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof promoteUser>>, TError, {
    userId: string;
    data: BodyType<PromoteUserBody>;
}, TContext>;
/**
 * @summary List all forum categories
 */
export declare const getListForumCategoriesUrl: () => string;
export declare const listForumCategories: (options?: RequestInit) => Promise<ForumCategory[]>;
export declare const getListForumCategoriesQueryKey: () => readonly ["/api/forums/categories"];
export declare const getListForumCategoriesQueryOptions: <TData = Awaited<ReturnType<typeof listForumCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listForumCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listForumCategories>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListForumCategoriesQueryResult = NonNullable<Awaited<ReturnType<typeof listForumCategories>>>;
export type ListForumCategoriesQueryError = ErrorType<unknown>;
/**
 * @summary List all forum categories
 */
export declare function useListForumCategories<TData = Awaited<ReturnType<typeof listForumCategories>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listForumCategories>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create forum category (admin)
 */
export declare const getCreateForumCategoryUrl: () => string;
export declare const createForumCategory: (createForumCategoryBody: CreateForumCategoryBody, options?: RequestInit) => Promise<ForumCategory>;
export declare const getCreateForumCategoryMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createForumCategory>>, TError, {
        data: BodyType<CreateForumCategoryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createForumCategory>>, TError, {
    data: BodyType<CreateForumCategoryBody>;
}, TContext>;
export type CreateForumCategoryMutationResult = NonNullable<Awaited<ReturnType<typeof createForumCategory>>>;
export type CreateForumCategoryMutationBody = BodyType<CreateForumCategoryBody>;
export type CreateForumCategoryMutationError = ErrorType<unknown>;
/**
 * @summary Create forum category (admin)
 */
export declare const useCreateForumCategory: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createForumCategory>>, TError, {
        data: BodyType<CreateForumCategoryBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createForumCategory>>, TError, {
    data: BodyType<CreateForumCategoryBody>;
}, TContext>;
/**
 * @summary List forum threads
 */
export declare const getListForumThreadsUrl: (params?: ListForumThreadsParams) => string;
export declare const listForumThreads: (params?: ListForumThreadsParams, options?: RequestInit) => Promise<ThreadListResponse>;
export declare const getListForumThreadsQueryKey: (params?: ListForumThreadsParams) => readonly ["/api/forums/threads", ...ListForumThreadsParams[]];
export declare const getListForumThreadsQueryOptions: <TData = Awaited<ReturnType<typeof listForumThreads>>, TError = ErrorType<unknown>>(params?: ListForumThreadsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listForumThreads>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listForumThreads>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListForumThreadsQueryResult = NonNullable<Awaited<ReturnType<typeof listForumThreads>>>;
export type ListForumThreadsQueryError = ErrorType<unknown>;
/**
 * @summary List forum threads
 */
export declare function useListForumThreads<TData = Awaited<ReturnType<typeof listForumThreads>>, TError = ErrorType<unknown>>(params?: ListForumThreadsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listForumThreads>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create forum thread
 */
export declare const getCreateForumThreadUrl: () => string;
export declare const createForumThread: (createThreadBody: CreateThreadBody, options?: RequestInit) => Promise<ForumThread>;
export declare const getCreateForumThreadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createForumThread>>, TError, {
        data: BodyType<CreateThreadBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createForumThread>>, TError, {
    data: BodyType<CreateThreadBody>;
}, TContext>;
export type CreateForumThreadMutationResult = NonNullable<Awaited<ReturnType<typeof createForumThread>>>;
export type CreateForumThreadMutationBody = BodyType<CreateThreadBody>;
export type CreateForumThreadMutationError = ErrorType<unknown>;
/**
 * @summary Create forum thread
 */
export declare const useCreateForumThread: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createForumThread>>, TError, {
        data: BodyType<CreateThreadBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createForumThread>>, TError, {
    data: BodyType<CreateThreadBody>;
}, TContext>;
/**
 * @summary Get forum thread with posts
 */
export declare const getGetForumThreadUrl: (threadId: number) => string;
export declare const getForumThread: (threadId: number, options?: RequestInit) => Promise<ForumThreadDetail>;
export declare const getGetForumThreadQueryKey: (threadId: number) => readonly [`/api/forums/threads/${number}`];
export declare const getGetForumThreadQueryOptions: <TData = Awaited<ReturnType<typeof getForumThread>>, TError = ErrorType<unknown>>(threadId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getForumThread>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getForumThread>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetForumThreadQueryResult = NonNullable<Awaited<ReturnType<typeof getForumThread>>>;
export type GetForumThreadQueryError = ErrorType<unknown>;
/**
 * @summary Get forum thread with posts
 */
export declare function useGetForumThread<TData = Awaited<ReturnType<typeof getForumThread>>, TError = ErrorType<unknown>>(threadId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getForumThread>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Delete forum thread (admin/author)
 */
export declare const getDeleteForumThreadUrl: (threadId: number) => string;
export declare const deleteForumThread: (threadId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteForumThreadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteForumThread>>, TError, {
        threadId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteForumThread>>, TError, {
    threadId: number;
}, TContext>;
export type DeleteForumThreadMutationResult = NonNullable<Awaited<ReturnType<typeof deleteForumThread>>>;
export type DeleteForumThreadMutationError = ErrorType<unknown>;
/**
 * @summary Delete forum thread (admin/author)
 */
export declare const useDeleteForumThread: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteForumThread>>, TError, {
        threadId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteForumThread>>, TError, {
    threadId: number;
}, TContext>;
/**
 * @summary Create post in thread
 */
export declare const getCreateForumPostUrl: (threadId: number) => string;
export declare const createForumPost: (threadId: number, createPostBody: CreatePostBody, options?: RequestInit) => Promise<ForumPost>;
export declare const getCreateForumPostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createForumPost>>, TError, {
        threadId: number;
        data: BodyType<CreatePostBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createForumPost>>, TError, {
    threadId: number;
    data: BodyType<CreatePostBody>;
}, TContext>;
export type CreateForumPostMutationResult = NonNullable<Awaited<ReturnType<typeof createForumPost>>>;
export type CreateForumPostMutationBody = BodyType<CreatePostBody>;
export type CreateForumPostMutationError = ErrorType<unknown>;
/**
 * @summary Create post in thread
 */
export declare const useCreateForumPost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createForumPost>>, TError, {
        threadId: number;
        data: BodyType<CreatePostBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createForumPost>>, TError, {
    threadId: number;
    data: BodyType<CreatePostBody>;
}, TContext>;
/**
 * @summary Pin/unpin forum thread (admin)
 */
export declare const getPinForumThreadUrl: (threadId: number) => string;
export declare const pinForumThread: (threadId: number, options?: RequestInit) => Promise<ForumThread>;
export declare const getPinForumThreadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof pinForumThread>>, TError, {
        threadId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof pinForumThread>>, TError, {
    threadId: number;
}, TContext>;
export type PinForumThreadMutationResult = NonNullable<Awaited<ReturnType<typeof pinForumThread>>>;
export type PinForumThreadMutationError = ErrorType<unknown>;
/**
 * @summary Pin/unpin forum thread (admin)
 */
export declare const usePinForumThread: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof pinForumThread>>, TError, {
        threadId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof pinForumThread>>, TError, {
    threadId: number;
}, TContext>;
/**
 * @summary Lock/unlock forum thread (admin)
 */
export declare const getLockForumThreadUrl: (threadId: number) => string;
export declare const lockForumThread: (threadId: number, options?: RequestInit) => Promise<ForumThread>;
export declare const getLockForumThreadMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof lockForumThread>>, TError, {
        threadId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof lockForumThread>>, TError, {
    threadId: number;
}, TContext>;
export type LockForumThreadMutationResult = NonNullable<Awaited<ReturnType<typeof lockForumThread>>>;
export type LockForumThreadMutationError = ErrorType<unknown>;
/**
 * @summary Lock/unlock forum thread (admin)
 */
export declare const useLockForumThread: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof lockForumThread>>, TError, {
        threadId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof lockForumThread>>, TError, {
    threadId: number;
}, TContext>;
/**
 * @summary Delete forum post (admin/author)
 */
export declare const getDeleteForumPostUrl: (postId: number) => string;
export declare const deleteForumPost: (postId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteForumPostMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteForumPost>>, TError, {
        postId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteForumPost>>, TError, {
    postId: number;
}, TContext>;
export type DeleteForumPostMutationResult = NonNullable<Awaited<ReturnType<typeof deleteForumPost>>>;
export type DeleteForumPostMutationError = ErrorType<unknown>;
/**
 * @summary Delete forum post (admin/author)
 */
export declare const useDeleteForumPost: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteForumPost>>, TError, {
        postId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteForumPost>>, TError, {
    postId: number;
}, TContext>;
/**
 * @summary Get forum statistics
 */
export declare const getGetForumStatsUrl: () => string;
export declare const getForumStats: (options?: RequestInit) => Promise<ForumStats>;
export declare const getGetForumStatsQueryKey: () => readonly ["/api/forums/stats"];
export declare const getGetForumStatsQueryOptions: <TData = Awaited<ReturnType<typeof getForumStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getForumStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getForumStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetForumStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getForumStats>>>;
export type GetForumStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get forum statistics
 */
export declare function useGetForumStats<TData = Awaited<ReturnType<typeof getForumStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getForumStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List announcements
 */
export declare const getListAnnouncementsUrl: (params?: ListAnnouncementsParams) => string;
export declare const listAnnouncements: (params?: ListAnnouncementsParams, options?: RequestInit) => Promise<AnnouncementListResponse>;
export declare const getListAnnouncementsQueryKey: (params?: ListAnnouncementsParams) => readonly ["/api/announcements", ...ListAnnouncementsParams[]];
export declare const getListAnnouncementsQueryOptions: <TData = Awaited<ReturnType<typeof listAnnouncements>>, TError = ErrorType<unknown>>(params?: ListAnnouncementsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAnnouncementsQueryResult = NonNullable<Awaited<ReturnType<typeof listAnnouncements>>>;
export type ListAnnouncementsQueryError = ErrorType<unknown>;
/**
 * @summary List announcements
 */
export declare function useListAnnouncements<TData = Awaited<ReturnType<typeof listAnnouncements>>, TError = ErrorType<unknown>>(params?: ListAnnouncementsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAnnouncements>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create announcement (admin)
 */
export declare const getCreateAnnouncementUrl: () => string;
export declare const createAnnouncement: (createAnnouncementBody: CreateAnnouncementBody, options?: RequestInit) => Promise<Announcement>;
export declare const getCreateAnnouncementMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAnnouncement>>, TError, {
        data: BodyType<CreateAnnouncementBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAnnouncement>>, TError, {
    data: BodyType<CreateAnnouncementBody>;
}, TContext>;
export type CreateAnnouncementMutationResult = NonNullable<Awaited<ReturnType<typeof createAnnouncement>>>;
export type CreateAnnouncementMutationBody = BodyType<CreateAnnouncementBody>;
export type CreateAnnouncementMutationError = ErrorType<unknown>;
/**
 * @summary Create announcement (admin)
 */
export declare const useCreateAnnouncement: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAnnouncement>>, TError, {
        data: BodyType<CreateAnnouncementBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAnnouncement>>, TError, {
    data: BodyType<CreateAnnouncementBody>;
}, TContext>;
/**
 * @summary Get announcement by ID
 */
export declare const getGetAnnouncementUrl: (announcementId: number) => string;
export declare const getAnnouncement: (announcementId: number, options?: RequestInit) => Promise<Announcement>;
export declare const getGetAnnouncementQueryKey: (announcementId: number) => readonly [`/api/announcements/${number}`];
export declare const getGetAnnouncementQueryOptions: <TData = Awaited<ReturnType<typeof getAnnouncement>>, TError = ErrorType<unknown>>(announcementId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAnnouncement>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAnnouncement>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAnnouncementQueryResult = NonNullable<Awaited<ReturnType<typeof getAnnouncement>>>;
export type GetAnnouncementQueryError = ErrorType<unknown>;
/**
 * @summary Get announcement by ID
 */
export declare function useGetAnnouncement<TData = Awaited<ReturnType<typeof getAnnouncement>>, TError = ErrorType<unknown>>(announcementId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAnnouncement>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update announcement (admin)
 */
export declare const getUpdateAnnouncementUrl: (announcementId: number) => string;
export declare const updateAnnouncement: (announcementId: number, createAnnouncementBody: CreateAnnouncementBody, options?: RequestInit) => Promise<Announcement>;
export declare const getUpdateAnnouncementMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAnnouncement>>, TError, {
        announcementId: number;
        data: BodyType<CreateAnnouncementBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAnnouncement>>, TError, {
    announcementId: number;
    data: BodyType<CreateAnnouncementBody>;
}, TContext>;
export type UpdateAnnouncementMutationResult = NonNullable<Awaited<ReturnType<typeof updateAnnouncement>>>;
export type UpdateAnnouncementMutationBody = BodyType<CreateAnnouncementBody>;
export type UpdateAnnouncementMutationError = ErrorType<unknown>;
/**
 * @summary Update announcement (admin)
 */
export declare const useUpdateAnnouncement: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAnnouncement>>, TError, {
        announcementId: number;
        data: BodyType<CreateAnnouncementBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAnnouncement>>, TError, {
    announcementId: number;
    data: BodyType<CreateAnnouncementBody>;
}, TContext>;
/**
 * @summary Delete announcement (admin)
 */
export declare const getDeleteAnnouncementUrl: (announcementId: number) => string;
export declare const deleteAnnouncement: (announcementId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteAnnouncementMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAnnouncement>>, TError, {
        announcementId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAnnouncement>>, TError, {
    announcementId: number;
}, TContext>;
export type DeleteAnnouncementMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAnnouncement>>>;
export type DeleteAnnouncementMutationError = ErrorType<unknown>;
/**
 * @summary Delete announcement (admin)
 */
export declare const useDeleteAnnouncement: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAnnouncement>>, TError, {
        announcementId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAnnouncement>>, TError, {
    announcementId: number;
}, TContext>;
/**
 * @summary List active bans
 */
export declare const getListBansUrl: (params?: ListBansParams) => string;
export declare const listBans: (params?: ListBansParams, options?: RequestInit) => Promise<BanListResponse>;
export declare const getListBansQueryKey: (params?: ListBansParams) => readonly ["/api/bans", ...ListBansParams[]];
export declare const getListBansQueryOptions: <TData = Awaited<ReturnType<typeof listBans>>, TError = ErrorType<unknown>>(params?: ListBansParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listBans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListBansQueryResult = NonNullable<Awaited<ReturnType<typeof listBans>>>;
export type ListBansQueryError = ErrorType<unknown>;
/**
 * @summary List active bans
 */
export declare function useListBans<TData = Awaited<ReturnType<typeof listBans>>, TError = ErrorType<unknown>>(params?: ListBansParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listBans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Ban a player (admin)
 */
export declare const getCreateBanUrl: () => string;
export declare const createBan: (createBanBody: CreateBanBody, options?: RequestInit) => Promise<Ban>;
export declare const getCreateBanMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBan>>, TError, {
        data: BodyType<CreateBanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createBan>>, TError, {
    data: BodyType<CreateBanBody>;
}, TContext>;
export type CreateBanMutationResult = NonNullable<Awaited<ReturnType<typeof createBan>>>;
export type CreateBanMutationBody = BodyType<CreateBanBody>;
export type CreateBanMutationError = ErrorType<unknown>;
/**
 * @summary Ban a player (admin)
 */
export declare const useCreateBan: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createBan>>, TError, {
        data: BodyType<CreateBanBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createBan>>, TError, {
    data: BodyType<CreateBanBody>;
}, TContext>;
/**
 * @summary Unban a player (admin)
 */
export declare const getUnbanPlayerUrl: (banId: number) => string;
export declare const unbanPlayer: (banId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getUnbanPlayerMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unbanPlayer>>, TError, {
        banId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof unbanPlayer>>, TError, {
    banId: number;
}, TContext>;
export type UnbanPlayerMutationResult = NonNullable<Awaited<ReturnType<typeof unbanPlayer>>>;
export type UnbanPlayerMutationError = ErrorType<unknown>;
/**
 * @summary Unban a player (admin)
 */
export declare const useUnbanPlayer: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof unbanPlayer>>, TError, {
        banId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof unbanPlayer>>, TError, {
    banId: number;
}, TContext>;
/**
 * @summary List ban appeals
 */
export declare const getListAppealsUrl: (params?: ListAppealsParams) => string;
export declare const listAppeals: (params?: ListAppealsParams, options?: RequestInit) => Promise<AppealListResponse>;
export declare const getListAppealsQueryKey: (params?: ListAppealsParams) => readonly ["/api/appeals", ...ListAppealsParams[]];
export declare const getListAppealsQueryOptions: <TData = Awaited<ReturnType<typeof listAppeals>>, TError = ErrorType<unknown>>(params?: ListAppealsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAppeals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAppeals>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAppealsQueryResult = NonNullable<Awaited<ReturnType<typeof listAppeals>>>;
export type ListAppealsQueryError = ErrorType<unknown>;
/**
 * @summary List ban appeals
 */
export declare function useListAppeals<TData = Awaited<ReturnType<typeof listAppeals>>, TError = ErrorType<unknown>>(params?: ListAppealsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAppeals>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit a ban appeal
 */
export declare const getCreateAppealUrl: () => string;
export declare const createAppeal: (createAppealBody: CreateAppealBody, options?: RequestInit) => Promise<Appeal>;
export declare const getCreateAppealMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppeal>>, TError, {
        data: BodyType<CreateAppealBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAppeal>>, TError, {
    data: BodyType<CreateAppealBody>;
}, TContext>;
export type CreateAppealMutationResult = NonNullable<Awaited<ReturnType<typeof createAppeal>>>;
export type CreateAppealMutationBody = BodyType<CreateAppealBody>;
export type CreateAppealMutationError = ErrorType<unknown>;
/**
 * @summary Submit a ban appeal
 */
export declare const useCreateAppeal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAppeal>>, TError, {
        data: BodyType<CreateAppealBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAppeal>>, TError, {
    data: BodyType<CreateAppealBody>;
}, TContext>;
/**
 * @summary Get appeal by ID
 */
export declare const getGetAppealUrl: (appealId: number) => string;
export declare const getAppeal: (appealId: number, options?: RequestInit) => Promise<Appeal>;
export declare const getGetAppealQueryKey: (appealId: number) => readonly [`/api/appeals/${number}`];
export declare const getGetAppealQueryOptions: <TData = Awaited<ReturnType<typeof getAppeal>>, TError = ErrorType<unknown>>(appealId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAppeal>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAppeal>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAppealQueryResult = NonNullable<Awaited<ReturnType<typeof getAppeal>>>;
export type GetAppealQueryError = ErrorType<unknown>;
/**
 * @summary Get appeal by ID
 */
export declare function useGetAppeal<TData = Awaited<ReturnType<typeof getAppeal>>, TError = ErrorType<unknown>>(appealId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAppeal>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Review a ban appeal (admin)
 */
export declare const getReviewAppealUrl: (appealId: number) => string;
export declare const reviewAppeal: (appealId: number, reviewAppealBody: ReviewAppealBody, options?: RequestInit) => Promise<Appeal>;
export declare const getReviewAppealMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reviewAppeal>>, TError, {
        appealId: number;
        data: BodyType<ReviewAppealBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reviewAppeal>>, TError, {
    appealId: number;
    data: BodyType<ReviewAppealBody>;
}, TContext>;
export type ReviewAppealMutationResult = NonNullable<Awaited<ReturnType<typeof reviewAppeal>>>;
export type ReviewAppealMutationBody = BodyType<ReviewAppealBody>;
export type ReviewAppealMutationError = ErrorType<unknown>;
/**
 * @summary Review a ban appeal (admin)
 */
export declare const useReviewAppeal: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reviewAppeal>>, TError, {
        appealId: number;
        data: BodyType<ReviewAppealBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reviewAppeal>>, TError, {
    appealId: number;
    data: BodyType<ReviewAppealBody>;
}, TContext>;
/**
 * @summary List staff applications (admin)
 */
export declare const getListApplicationsUrl: (params?: ListApplicationsParams) => string;
export declare const listApplications: (params?: ListApplicationsParams, options?: RequestInit) => Promise<ApplicationListResponse>;
export declare const getListApplicationsQueryKey: (params?: ListApplicationsParams) => readonly ["/api/applications", ...ListApplicationsParams[]];
export declare const getListApplicationsQueryOptions: <TData = Awaited<ReturnType<typeof listApplications>>, TError = ErrorType<unknown>>(params?: ListApplicationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListApplicationsQueryResult = NonNullable<Awaited<ReturnType<typeof listApplications>>>;
export type ListApplicationsQueryError = ErrorType<unknown>;
/**
 * @summary List staff applications (admin)
 */
export declare function useListApplications<TData = Awaited<ReturnType<typeof listApplications>>, TError = ErrorType<unknown>>(params?: ListApplicationsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listApplications>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Submit staff application
 */
export declare const getCreateApplicationUrl: () => string;
export declare const createApplication: (createApplicationBody: CreateApplicationBody, options?: RequestInit) => Promise<StaffApplication>;
export declare const getCreateApplicationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
        data: BodyType<CreateApplicationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
    data: BodyType<CreateApplicationBody>;
}, TContext>;
export type CreateApplicationMutationResult = NonNullable<Awaited<ReturnType<typeof createApplication>>>;
export type CreateApplicationMutationBody = BodyType<CreateApplicationBody>;
export type CreateApplicationMutationError = ErrorType<unknown>;
/**
 * @summary Submit staff application
 */
export declare const useCreateApplication: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createApplication>>, TError, {
        data: BodyType<CreateApplicationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createApplication>>, TError, {
    data: BodyType<CreateApplicationBody>;
}, TContext>;
/**
 * @summary Review staff application (admin)
 */
export declare const getReviewApplicationUrl: (applicationId: number) => string;
export declare const reviewApplication: (applicationId: number, reviewApplicationBody: ReviewApplicationBody, options?: RequestInit) => Promise<StaffApplication>;
export declare const getReviewApplicationMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reviewApplication>>, TError, {
        applicationId: number;
        data: BodyType<ReviewApplicationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reviewApplication>>, TError, {
    applicationId: number;
    data: BodyType<ReviewApplicationBody>;
}, TContext>;
export type ReviewApplicationMutationResult = NonNullable<Awaited<ReturnType<typeof reviewApplication>>>;
export type ReviewApplicationMutationBody = BodyType<ReviewApplicationBody>;
export type ReviewApplicationMutationError = ErrorType<unknown>;
/**
 * @summary Review staff application (admin)
 */
export declare const useReviewApplication: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reviewApplication>>, TError, {
        applicationId: number;
        data: BodyType<ReviewApplicationBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reviewApplication>>, TError, {
    applicationId: number;
    data: BodyType<ReviewApplicationBody>;
}, TContext>;
/**
 * @summary Get server status and online players
 */
export declare const getGetServerStatusUrl: () => string;
export declare const getServerStatus: (options?: RequestInit) => Promise<ServerStatus>;
export declare const getGetServerStatusQueryKey: () => readonly ["/api/server/status"];
export declare const getGetServerStatusQueryOptions: <TData = Awaited<ReturnType<typeof getServerStatus>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getServerStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getServerStatus>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetServerStatusQueryResult = NonNullable<Awaited<ReturnType<typeof getServerStatus>>>;
export type GetServerStatusQueryError = ErrorType<unknown>;
/**
 * @summary Get server status and online players
 */
export declare function useGetServerStatus<TData = Awaited<ReturnType<typeof getServerStatus>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getServerStatus>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get overall server statistics
 */
export declare const getGetServerStatsUrl: () => string;
export declare const getServerStats: (options?: RequestInit) => Promise<ServerStats>;
export declare const getGetServerStatsQueryKey: () => readonly ["/api/server/stats"];
export declare const getGetServerStatsQueryOptions: <TData = Awaited<ReturnType<typeof getServerStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getServerStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getServerStats>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetServerStatsQueryResult = NonNullable<Awaited<ReturnType<typeof getServerStats>>>;
export type GetServerStatsQueryError = ErrorType<unknown>;
/**
 * @summary Get overall server statistics
 */
export declare function useGetServerStats<TData = Awaited<ReturnType<typeof getServerStats>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getServerStats>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get player leaderboard
 */
export declare const getGetLeaderboardUrl: (params?: GetLeaderboardParams) => string;
export declare const getLeaderboard: (params?: GetLeaderboardParams, options?: RequestInit) => Promise<LeaderboardEntry[]>;
export declare const getGetLeaderboardQueryKey: (params?: GetLeaderboardParams) => readonly ["/api/leaderboard", ...GetLeaderboardParams[]];
export declare const getGetLeaderboardQueryOptions: <TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(params?: GetLeaderboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetLeaderboardQueryResult = NonNullable<Awaited<ReturnType<typeof getLeaderboard>>>;
export type GetLeaderboardQueryError = ErrorType<unknown>;
/**
 * @summary Get player leaderboard
 */
export declare function useGetLeaderboard<TData = Awaited<ReturnType<typeof getLeaderboard>>, TError = ErrorType<unknown>>(params?: GetLeaderboardParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getLeaderboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List vote sites and user vote status
 */
export declare const getListVoteSitesUrl: () => string;
export declare const listVoteSites: (options?: RequestInit) => Promise<VoteSiteListResponse>;
export declare const getListVoteSitesQueryKey: () => readonly ["/api/votes"];
export declare const getListVoteSitesQueryOptions: <TData = Awaited<ReturnType<typeof listVoteSites>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVoteSites>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listVoteSites>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListVoteSitesQueryResult = NonNullable<Awaited<ReturnType<typeof listVoteSites>>>;
export type ListVoteSitesQueryError = ErrorType<unknown>;
/**
 * @summary List vote sites and user vote status
 */
export declare function useListVoteSites<TData = Awaited<ReturnType<typeof listVoteSites>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listVoteSites>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Record a vote
 */
export declare const getRecordVoteUrl: () => string;
export declare const recordVote: (recordVoteBody: RecordVoteBody, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getRecordVoteMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordVote>>, TError, {
        data: BodyType<RecordVoteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof recordVote>>, TError, {
    data: BodyType<RecordVoteBody>;
}, TContext>;
export type RecordVoteMutationResult = NonNullable<Awaited<ReturnType<typeof recordVote>>>;
export type RecordVoteMutationBody = BodyType<RecordVoteBody>;
export type RecordVoteMutationError = ErrorType<unknown>;
/**
 * @summary Record a vote
 */
export declare const useRecordVote: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof recordVote>>, TError, {
        data: BodyType<RecordVoteBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof recordVote>>, TError, {
    data: BodyType<RecordVoteBody>;
}, TContext>;
/**
 * @summary List gallery images
 */
export declare const getListGalleryImagesUrl: () => string;
export declare const listGalleryImages: (options?: RequestInit) => Promise<GalleryImage[]>;
export declare const getListGalleryImagesQueryKey: () => readonly ["/api/gallery"];
export declare const getListGalleryImagesQueryOptions: <TData = Awaited<ReturnType<typeof listGalleryImages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGalleryImages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listGalleryImages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListGalleryImagesQueryResult = NonNullable<Awaited<ReturnType<typeof listGalleryImages>>>;
export type ListGalleryImagesQueryError = ErrorType<unknown>;
/**
 * @summary List gallery images
 */
export declare function useListGalleryImages<TData = Awaited<ReturnType<typeof listGalleryImages>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listGalleryImages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Add gallery image (admin)
 */
export declare const getCreateGalleryImageUrl: () => string;
export declare const createGalleryImage: (createGalleryImageBody: CreateGalleryImageBody, options?: RequestInit) => Promise<GalleryImage>;
export declare const getCreateGalleryImageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGalleryImage>>, TError, {
        data: BodyType<CreateGalleryImageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createGalleryImage>>, TError, {
    data: BodyType<CreateGalleryImageBody>;
}, TContext>;
export type CreateGalleryImageMutationResult = NonNullable<Awaited<ReturnType<typeof createGalleryImage>>>;
export type CreateGalleryImageMutationBody = BodyType<CreateGalleryImageBody>;
export type CreateGalleryImageMutationError = ErrorType<unknown>;
/**
 * @summary Add gallery image (admin)
 */
export declare const useCreateGalleryImage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createGalleryImage>>, TError, {
        data: BodyType<CreateGalleryImageBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createGalleryImage>>, TError, {
    data: BodyType<CreateGalleryImageBody>;
}, TContext>;
/**
 * @summary Delete gallery image (admin)
 */
export declare const getDeleteGalleryImageUrl: (imageId: number) => string;
export declare const deleteGalleryImage: (imageId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteGalleryImageMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
        imageId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
    imageId: number;
}, TContext>;
export type DeleteGalleryImageMutationResult = NonNullable<Awaited<ReturnType<typeof deleteGalleryImage>>>;
export type DeleteGalleryImageMutationError = ErrorType<unknown>;
/**
 * @summary Delete gallery image (admin)
 */
export declare const useDeleteGalleryImage: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
        imageId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteGalleryImage>>, TError, {
    imageId: number;
}, TContext>;
/**
 * @summary List server rules
 */
export declare const getListRulesUrl: () => string;
export declare const listRules: (options?: RequestInit) => Promise<Rule[]>;
export declare const getListRulesQueryKey: () => readonly ["/api/rules"];
export declare const getListRulesQueryOptions: <TData = Awaited<ReturnType<typeof listRules>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRules>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listRules>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListRulesQueryResult = NonNullable<Awaited<ReturnType<typeof listRules>>>;
export type ListRulesQueryError = ErrorType<unknown>;
/**
 * @summary List server rules
 */
export declare function useListRules<TData = Awaited<ReturnType<typeof listRules>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listRules>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create rule (admin)
 */
export declare const getCreateRuleUrl: () => string;
export declare const createRule: (createRuleBody: CreateRuleBody, options?: RequestInit) => Promise<Rule>;
export declare const getCreateRuleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRule>>, TError, {
        data: BodyType<CreateRuleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createRule>>, TError, {
    data: BodyType<CreateRuleBody>;
}, TContext>;
export type CreateRuleMutationResult = NonNullable<Awaited<ReturnType<typeof createRule>>>;
export type CreateRuleMutationBody = BodyType<CreateRuleBody>;
export type CreateRuleMutationError = ErrorType<unknown>;
/**
 * @summary Create rule (admin)
 */
export declare const useCreateRule: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createRule>>, TError, {
        data: BodyType<CreateRuleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createRule>>, TError, {
    data: BodyType<CreateRuleBody>;
}, TContext>;
/**
 * @summary Update rule (admin)
 */
export declare const getUpdateRuleUrl: (ruleId: number) => string;
export declare const updateRule: (ruleId: number, createRuleBody: CreateRuleBody, options?: RequestInit) => Promise<Rule>;
export declare const getUpdateRuleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRule>>, TError, {
        ruleId: number;
        data: BodyType<CreateRuleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateRule>>, TError, {
    ruleId: number;
    data: BodyType<CreateRuleBody>;
}, TContext>;
export type UpdateRuleMutationResult = NonNullable<Awaited<ReturnType<typeof updateRule>>>;
export type UpdateRuleMutationBody = BodyType<CreateRuleBody>;
export type UpdateRuleMutationError = ErrorType<unknown>;
/**
 * @summary Update rule (admin)
 */
export declare const useUpdateRule: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateRule>>, TError, {
        ruleId: number;
        data: BodyType<CreateRuleBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateRule>>, TError, {
    ruleId: number;
    data: BodyType<CreateRuleBody>;
}, TContext>;
/**
 * @summary Delete rule (admin)
 */
export declare const getDeleteRuleUrl: (ruleId: number) => string;
export declare const deleteRule: (ruleId: number, options?: RequestInit) => Promise<SuccessResponse>;
export declare const getDeleteRuleMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRule>>, TError, {
        ruleId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteRule>>, TError, {
    ruleId: number;
}, TContext>;
export type DeleteRuleMutationResult = NonNullable<Awaited<ReturnType<typeof deleteRule>>>;
export type DeleteRuleMutationError = ErrorType<unknown>;
/**
 * @summary Delete rule (admin)
 */
export declare const useDeleteRule: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteRule>>, TError, {
        ruleId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteRule>>, TError, {
    ruleId: number;
}, TContext>;
/**
 * @summary List store items
 */
export declare const getListStoreItemsUrl: () => string;
export declare const listStoreItems: (options?: RequestInit) => Promise<StoreItem[]>;
export declare const getListStoreItemsQueryKey: () => readonly ["/api/store/items"];
export declare const getListStoreItemsQueryOptions: <TData = Awaited<ReturnType<typeof listStoreItems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStoreItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listStoreItems>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListStoreItemsQueryResult = NonNullable<Awaited<ReturnType<typeof listStoreItems>>>;
export type ListStoreItemsQueryError = ErrorType<unknown>;
/**
 * @summary List store items
 */
export declare function useListStoreItems<TData = Awaited<ReturnType<typeof listStoreItems>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listStoreItems>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create store item (admin)
 */
export declare const getCreateStoreItemUrl: () => string;
export declare const createStoreItem: (createStoreItemBody: CreateStoreItemBody, options?: RequestInit) => Promise<StoreItem>;
export declare const getCreateStoreItemMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStoreItem>>, TError, {
        data: BodyType<CreateStoreItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createStoreItem>>, TError, {
    data: BodyType<CreateStoreItemBody>;
}, TContext>;
export type CreateStoreItemMutationResult = NonNullable<Awaited<ReturnType<typeof createStoreItem>>>;
export type CreateStoreItemMutationBody = BodyType<CreateStoreItemBody>;
export type CreateStoreItemMutationError = ErrorType<unknown>;
/**
 * @summary Create store item (admin)
 */
export declare const useCreateStoreItem: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createStoreItem>>, TError, {
        data: BodyType<CreateStoreItemBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createStoreItem>>, TError, {
    data: BodyType<CreateStoreItemBody>;
}, TContext>;
/**
 * @summary List changelogs
 */
export declare const getListChangelogsUrl: (params?: ListChangelogsParams) => string;
export declare const listChangelogs: (params?: ListChangelogsParams, options?: RequestInit) => Promise<ChangelogListResponse>;
export declare const getListChangelogsQueryKey: (params?: ListChangelogsParams) => readonly ["/api/changelog", ...ListChangelogsParams[]];
export declare const getListChangelogsQueryOptions: <TData = Awaited<ReturnType<typeof listChangelogs>>, TError = ErrorType<unknown>>(params?: ListChangelogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listChangelogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listChangelogs>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListChangelogsQueryResult = NonNullable<Awaited<ReturnType<typeof listChangelogs>>>;
export type ListChangelogsQueryError = ErrorType<unknown>;
/**
 * @summary List changelogs
 */
export declare function useListChangelogs<TData = Awaited<ReturnType<typeof listChangelogs>>, TError = ErrorType<unknown>>(params?: ListChangelogsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listChangelogs>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create changelog entry (admin)
 */
export declare const getCreateChangelogUrl: () => string;
export declare const createChangelog: (createChangelogBody: CreateChangelogBody, options?: RequestInit) => Promise<Changelog>;
export declare const getCreateChangelogMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createChangelog>>, TError, {
        data: BodyType<CreateChangelogBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createChangelog>>, TError, {
    data: BodyType<CreateChangelogBody>;
}, TContext>;
export type CreateChangelogMutationResult = NonNullable<Awaited<ReturnType<typeof createChangelog>>>;
export type CreateChangelogMutationBody = BodyType<CreateChangelogBody>;
export type CreateChangelogMutationError = ErrorType<unknown>;
/**
 * @summary Create changelog entry (admin)
 */
export declare const useCreateChangelog: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createChangelog>>, TError, {
        data: BodyType<CreateChangelogBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createChangelog>>, TError, {
    data: BodyType<CreateChangelogBody>;
}, TContext>;
/**
 * @summary List support tickets
 */
export declare const getListTicketsUrl: (params?: ListTicketsParams) => string;
export declare const listTickets: (params?: ListTicketsParams, options?: RequestInit) => Promise<TicketListResponse>;
export declare const getListTicketsQueryKey: (params?: ListTicketsParams) => readonly ["/api/tickets", ...ListTicketsParams[]];
export declare const getListTicketsQueryOptions: <TData = Awaited<ReturnType<typeof listTickets>>, TError = ErrorType<unknown>>(params?: ListTicketsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTickets>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listTickets>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListTicketsQueryResult = NonNullable<Awaited<ReturnType<typeof listTickets>>>;
export type ListTicketsQueryError = ErrorType<unknown>;
/**
 * @summary List support tickets
 */
export declare function useListTickets<TData = Awaited<ReturnType<typeof listTickets>>, TError = ErrorType<unknown>>(params?: ListTicketsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listTickets>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create support ticket
 */
export declare const getCreateTicketUrl: () => string;
export declare const createTicket: (createTicketBody: CreateTicketBody, options?: RequestInit) => Promise<Ticket>;
export declare const getCreateTicketMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTicket>>, TError, {
        data: BodyType<CreateTicketBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createTicket>>, TError, {
    data: BodyType<CreateTicketBody>;
}, TContext>;
export type CreateTicketMutationResult = NonNullable<Awaited<ReturnType<typeof createTicket>>>;
export type CreateTicketMutationBody = BodyType<CreateTicketBody>;
export type CreateTicketMutationError = ErrorType<unknown>;
/**
 * @summary Create support ticket
 */
export declare const useCreateTicket: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createTicket>>, TError, {
        data: BodyType<CreateTicketBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createTicket>>, TError, {
    data: BodyType<CreateTicketBody>;
}, TContext>;
/**
 * @summary Get ticket by ID
 */
export declare const getGetTicketUrl: (ticketId: number) => string;
export declare const getTicket: (ticketId: number, options?: RequestInit) => Promise<Ticket>;
export declare const getGetTicketQueryKey: (ticketId: number) => readonly [`/api/tickets/${number}`];
export declare const getGetTicketQueryOptions: <TData = Awaited<ReturnType<typeof getTicket>>, TError = ErrorType<unknown>>(ticketId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTicket>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTicket>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTicketQueryResult = NonNullable<Awaited<ReturnType<typeof getTicket>>>;
export type GetTicketQueryError = ErrorType<unknown>;
/**
 * @summary Get ticket by ID
 */
export declare function useGetTicket<TData = Awaited<ReturnType<typeof getTicket>>, TError = ErrorType<unknown>>(ticketId: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTicket>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Close a ticket (admin)
 */
export declare const getCloseTicketUrl: (ticketId: number) => string;
export declare const closeTicket: (ticketId: number, options?: RequestInit) => Promise<Ticket>;
export declare const getCloseTicketMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof closeTicket>>, TError, {
        ticketId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof closeTicket>>, TError, {
    ticketId: number;
}, TContext>;
export type CloseTicketMutationResult = NonNullable<Awaited<ReturnType<typeof closeTicket>>>;
export type CloseTicketMutationError = ErrorType<unknown>;
/**
 * @summary Close a ticket (admin)
 */
export declare const useCloseTicket: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof closeTicket>>, TError, {
        ticketId: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof closeTicket>>, TError, {
    ticketId: number;
}, TContext>;
/**
 * @summary Get admin dashboard stats
 */
export declare const getGetAdminDashboardUrl: () => string;
export declare const getAdminDashboard: (options?: RequestInit) => Promise<AdminDashboard>;
export declare const getGetAdminDashboardQueryKey: () => readonly ["/api/admin/dashboard"];
export declare const getGetAdminDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminDashboard>>>;
export type GetAdminDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get admin dashboard stats
 */
export declare function useGetAdminDashboard<TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Verify admin password
 */
export declare const getVerifyAdminUrl: () => string;
export declare const verifyAdmin: (verifyAdminBody: VerifyAdminBody, options?: RequestInit) => Promise<VerifyAdminResponse>;
export declare const getVerifyAdminMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyAdmin>>, TError, {
        data: BodyType<VerifyAdminBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof verifyAdmin>>, TError, {
    data: BodyType<VerifyAdminBody>;
}, TContext>;
export type VerifyAdminMutationResult = NonNullable<Awaited<ReturnType<typeof verifyAdmin>>>;
export type VerifyAdminMutationBody = BodyType<VerifyAdminBody>;
export type VerifyAdminMutationError = ErrorType<unknown>;
/**
 * @summary Verify admin password
 */
export declare const useVerifyAdmin: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyAdmin>>, TError, {
        data: BodyType<VerifyAdminBody>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof verifyAdmin>>, TError, {
    data: BodyType<VerifyAdminBody>;
}, TContext>;
export {};
//# sourceMappingURL=api.d.ts.map