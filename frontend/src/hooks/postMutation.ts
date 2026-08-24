import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LikeBody } from "../lib/postInterfaces";
import { axiosClient } from "../lib/axios";

async function postLike(postId: string, liked: boolean): Promise<void> {
  if (liked) {
    return await axiosClient.delete(`/post/like/${postId}`);
  } 
    return await axiosClient.post(`/post/like/${postId}`);
 
}

export function usePostToggleLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, liked }: LikeBody) => postLike(postId, liked),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
