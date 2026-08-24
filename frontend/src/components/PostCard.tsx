import type { Post } from "../lib/postInterfaces";
import { Heart, MessageCircle } from "lucide-react";

interface PostProps {
  post: Post;
  onToggleLike?: (postId: string, liked: boolean) => void;
}

export default function Post({ post, onToggleLike }: PostProps) {
    
    return(
        <article  className="mb-4 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-700 font-mono text-xs font-semibold text-white">
          {post.username}
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-neutral-100">
            @{post.username}
          </p>
          <p className="font-mono text-[11px] text-neutral-500">
            {post.createdAt}
          </p>
        </div>
        {post.myPost && (
          <span className="ml-auto rounded-full border border-pink-500/30 bg-pink-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-pink-400">
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
                : "text-neutral-400 group-hover:text-pink-400"
            }
          />
          <span
            className={`font-mono text-sm ${
              post.iLike ? "text-pink-500" : "text-neutral-400"
            }`}
          >
            {post.numberLikes}
          </span>
        </button>
 
        <div className="flex items-center gap-1.5 text-neutral-400">
          <MessageCircle size={20} />
          <span className="font-mono text-sm">{post.commentsCount}</span>
        </div>
      </div>
 
      {/* Texto */}
      {post.text && (
        <p className="px-4 pb-4 pt-2 text-sm leading-relaxed text-neutral-200">
          <span className="font-semibold text-neutral-100">
            @{post.username}
          </span>{" "}
          {post.text}
        </p>
      )}
    </article>
    )
}