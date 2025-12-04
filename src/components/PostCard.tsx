import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "./ui/button";
import { ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  email: string;
  userId: string;
  createdAt: string;
  currentUserId: string;
  likes: number;
  dislikes: number;
  onDelete: () => void;
  onVote: (id: string, type: "like" | "dislike") => void;
  userVote?: "like" | "dislike" | null;
}

export const PostCard = ({
  id,
  title,
  description,
  email,
  createdAt,
  onDelete,
  currentUserId,
  userId,
  likes,
  dislikes,
  onVote,
  userVote,
}: PostCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="flex w-full flex-col transition-shadow hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          {currentUserId === userId && (
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              aria-label="Excluir post"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>por {email}</span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="flex-1 whitespace-pre-wrap text-foreground">{description}</p>
        <div className="mt-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex h-8 w-8 items-center justify-center p-0"
            onClick={() => onVote(id, "like")}
            aria-label="Curtir"
            disabled={userVote === "like"}
          >
            <ThumbsUp
              className={`h-5 w-5 ${userVote === "like" ? "opacity-50" : ""}`}
            />
          </Button>
          <span className="text-sm font-semibold">{likes}</span>
          <Button
            variant="ghost"
            size="sm"
            className="flex h-8 w-8 items-center justify-center p-0"
            onClick={() => onVote(id, "dislike")}
            aria-label="Descurtir"
            disabled={userVote === "dislike"}
          >
            <ThumbsDown
              className={`h-5 w-5 ${userVote === "dislike" ? "opacity-50" : ""}`}
            />
          </Button>
          <span className="text-sm text-muted-foreground">{dislikes}</span>
        </div>
      </CardContent>
    </Card>
  );
};
