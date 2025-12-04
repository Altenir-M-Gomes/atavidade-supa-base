import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "./ui/button";

interface PostCardProps {
  id: string;
  title: string;
  description: string;
  email: string;
  userId: string,
  createdAt: string;
  currentUserId: string;
  onDelete: (id: string) => void;
}

export const PostCard = ({ id, title, description, email, createdAt, onDelete, currentUserId, userId }: PostCardProps) => {
  const timeAgo = formatDistanceToNow(new Date(createdAt), {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          {currentUserId === userId && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(id)}
            >
              Deletar
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>por {email}</span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground whitespace-pre-wrap">{description}</p>
      </CardContent>
    </Card>
  );
};