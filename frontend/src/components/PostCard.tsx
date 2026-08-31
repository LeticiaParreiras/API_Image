import type { Post } from "../lib/postInterfaces";
import { Heart, MessageCircle } from "lucide-react";
import { Button } from "../shared/Button";
import { Link } from "react-router-dom";

interface PostProps {
  post: Post;
  onToggleLike?: (postId: string, liked: boolean) => void;
}

export default function Post({ post, onToggleLike }: PostProps) {
      const formatDate = new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(post.createdAt));
    return(
        <article  className="mb-4 overflow-hidden rounded-xl border border-border bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-muted-primary  text-xs font-semibold text-primary-foreground">
          {post.username}
        </div>
        <div className="min-w-0">
          <Link className="truncate font-semibold text-foreground hover:underline" to={`/profile/${post.username}`}>
            @{post.username}
          </Link>
          <p className=" text-[11px] ">
            {formatDate}
          </p>
        </div>
        {post.myPost && (
          <span className="ml-auto rounded-full border border-primary bg-primary p-2 text-[10px] uppercase tracking-wide text-primary-foreground">
            Você
          </span>
        )}
      </div>
 
      {/* Imagem */}
      <div className="bg-neutral-950 max-h-[600px] max-w-[600px]">
        <img
          className=" w-full object-cover"
          src={post.imageUrl}
          alt={post.text || `Post de @${post.username}`}
          loading="lazy"
        />
      </div>
 
      {/* Ações */}
      <div className="flex items-center gap-4 px-4 pt-3">
        <Button
         variant="ghost"
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
                ? "fill-primary text-primary"
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
        </Button>
 
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <MessageCircle size={20} />
          <span className=" text-sm">{post.commentsCount}</span>
        </div>
      </div>
 
      {/* Texto */}
        <p className="px-4 pb-4 pt-2 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-muted-foreground">
            @{post.username}
          </span>{" "}
          {post.text}
        </p>
    </article>
    )
}