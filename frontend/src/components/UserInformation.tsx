import { Calendar } from "lucide-react";
import type { userResponse } from "../hooks/useUser";
import { Button } from "../shared/Button";
import { useFollow } from "../hooks/FollowMutation";
interface Props{
    user: userResponse,
    isOwnPage: boolean,
    onFollow?: (username: string, followed: boolean) => void;

}
export function UserInformation({ user, isOwnPage, onFollow }: Props,) {
  const { name, username, biography, createdAt } = user;
  const {} = useFollow()
  const formatDate = new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(new Date(createdAt));


  return (
    <div className="flex gap-4 w-full p-4">
      <div>
        <div className="icon rounded-full w-20 h-20 bg-primary"></div>
      </div>
      <div className="w-md">
        <h2 className="text-lg font-semibold text-foreground">{name}</h2>
        <p className="font-mono text-sm text-muted-foreground">@{username}</p>
        {biography && (
          <p className="mt-3 text-sm leading-relaxed text-foreground tab-1">
            {biography}
          </p>
        )}
        <span className="font-mono mt-3 text-xs text-muted-foreground flex gap-1">
          <Calendar size={16} />
          Entrou em: {formatDate}
        </span>
        <div className="mt-3 w-full">
          {isOwnPage ? (
            <Button variant="primary" disabled={true}>Editar perfil</Button>
          ) : (
            <Button variant="primary" onClick={()=>onFollow(user.username, user.followed??false)}>{user.followed? 'Deixar de seguir': 'Seguir'}</Button>
          )}
        </div>
      </div>
    </div>
  );
}
