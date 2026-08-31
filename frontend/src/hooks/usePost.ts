import { useInfiniteQuery } from '@tanstack/react-query';
import { axiosClient } from '../lib/axios';
import type { PaginatedPosts, Post } from '../lib/postInterfaces';
 
const PAGE_SIZE = 5;
type FeedType = "recent" | "following" | "user";

interface UsePostsParams {
  type: FeedType;
  username?: string; // obrigatório quando type === "user"
}
 
async function fetchPosts(page: number, endpoint: string): Promise<PaginatedPosts> {
  const response = await axiosClient.get<PaginatedPosts>(`${endpoint}`, {
    params: { page, limit: PAGE_SIZE },
  });

  return response.data;

}
 
export function usePosts({ type, username }: UsePostsParams){
    const endpoint =
      type === "user"
        ? `post/user/${username}`
        : type === "following"
        ? "post/Ifollow"
        : "/post";
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: ({ pageParam = 1 }) => fetchPosts(pageParam, endpoint),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: type !== "user" || !!username,
  });
}
