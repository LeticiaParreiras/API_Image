import type { Post } from "../lib/postInterfaces";
import { Heart, MessageCircle } from "lucide-react";

interface PostProps {
  post: Post;
  onToggleLike?: (postId: string, liked: boolean) => void;
}

export default function Post({ post, onToggleLike }: PostProps) {
    
    return(
        <article  className="mb-4 overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-muted-primary  text-xs font-semibold text-foreground">
          {post.username}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-foreground">
            @{post.username}
          </p>
          <p className=" text-[11px] ">
            {post.createdAt}
          </p>
        </div>
        {post.myPost && (
          <span className="ml-auto rounded-full border border-primary  bg-primary px-2 py-0.5  text-[10px] uppercase tracking-wide text-primary-foreground ">
            Você
          </span>
        )}
      </div>
 
      {/* Imagem */}
      <div className="bg-neutral-950">
        <img
          className="max-h-[600px] w-full object-cover"
          src={post.imageUrl}
          alt={post.text || `Post de @${post.username}`}
          loading="lazy"
        />
      </div>
 
      {/* Ações */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <button
          type="button"
          onClick={() => onToggleLike?.(post.id, Boolean(post.iLike))}
          className="group flex items-center gap-1.5 transition-colors"
          aria-pressed={post.iLike}
          aria-label={post.iLike ? "Descurtir" : "Curtir"}
        >
          <Heart
            size={22}
            className={
              post.iLike
                ? "fill-pink-500 text-pink-500"
                : "text-muted-foreground group-hover:text-primary"
            }
          />
          <span
            className={` text-sm ${
              post.iLike ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {post.numberLikes}
          </span>
        </button>
 
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle size={20} />
          <span className=" text-sm">{post.commentsCount}</span>
        </div>
      </div>
 
      {/* Texto */}
      {post.text && (
        <p className="px-4 pb-4 pt-2 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-muted-foreground">
            @{post.username}
          </span>{" "}
          {post.text}
        </p>
      )}
    </article>
    )
}