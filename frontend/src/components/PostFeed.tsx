
import React, { useRef, useEffect } from "react";
import { usePosts } from "../hooks/usePost";
import Post from "./PostCard";
import { usePostToggleLike } from "../hooks/postMutation";

interface PostFeedProps {
  type: "recent" | "following" | "user";
  username?: string;
  emptyMessage?: string;
}

export default function PostFeed({
  type,
  username,
  emptyMessage = "Nenhum post encontrado",
}: PostFeedProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts({ type, username });
  const toggleLike = usePostToggleLike();
  const posts = data?.pages.flatMap((p) => p.posts) ?? [];
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) fetchNextPage();
      },
      { root: null, rootMargin: "200px" }
    );

    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <p>Carregando posts…</p>;
  }

  if (posts.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <div className="max-h-[90vh] overflow-y-auto p-4 m-auto">
      {posts.map((post) => (
        <Post
          post={post}
          key={post.id}
          onToggleLike={(postId, liked) => toggleLike.mutate({ postId, liked })}
        />
      ))}
      <div ref={sentinelRef} />
      {isFetchingNextPage && <p>Carregando mais…</p>}
      {!hasNextPage && <p className="text-center text-muted-foreground">Desculpa, não temos mais posts : &#40;</p>}
    </div>
  );
}