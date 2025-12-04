import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface Post {
  id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  user_email?: string;
  likes: number;
  dislikes: number;
  userVote?: "like" | "dislike" | null;
}

const POSTS_PER_PAGE = 10;

export const PostsFeed = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<{ id?: string }>({});
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);
  const [postPendingDeletion, setPostPendingDeletion] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeletePost = (post: Post) => {
    setPostPendingDeletion(post);
  };

  const confirmDeletePost = async () => {
    if (!postPendingDeletion) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postPendingDeletion.id);

      if (error) throw error;

      setPosts((prev) => prev.filter((post) => post.id !== postPendingDeletion.id));
    } catch (error) {
      console.error("Erro ao deletar post:", error);
    } finally {
      setIsDeleting(false);
      setPostPendingDeletion(null);
    }
  };

  const handleVote = async (postId: string, type: "like" | "dislike") => {
    try {
      const { error } = await supabase.rpc("vote_on_post", {
        p_post_id: postId,
        p_vote_type: type,
      });

      if (error) throw error;

      // ✅ Atualização local (sem reload)
      setPosts((prev) =>
        prev.map((post) => {
          if (post.id !== postId) return post;

          let likes = post.likes;
          let dislikes = post.dislikes;

          // Remove voto anterior
          if (post.userVote === "like") likes--;
          if (post.userVote === "dislike") dislikes--;

          // Aplica novo voto
          if (type === "like") likes++;
          if (type === "dislike") dislikes++;

          return {
            ...post,
            likes,
            dislikes,
            userVote: type,
          };
        })
      );
    } catch (error) {
      console.error("Erro ao votar:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        console.log("User:", user);

        setUser(user);
      }
    };

    fetchUser();
  }, []);

  const loadPosts = useCallback(async (pageNum: number, shouldReset = false) => {
    try {
      const from = pageNum * POSTS_PER_PAGE;
      const to = from + POSTS_PER_PAGE - 1;

      const { data, error } = await supabase
        .from("posts")
        .select(`
        id,
        title,
        description,
        created_at,
        updated_at,
        user_id,
        user_email,
        post_votes (
          user_id,
          vote_type
        )
      `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (!data) return;

      const userId = user?.id;

      const normalized: Post[] = data.map((post) => {
        const likes = post.post_votes.filter((v: any) => v.vote_type === "like").length;
        const dislikes = post.post_votes.filter((v: any) => v.vote_type === "dislike").length;

        const userVoteObj = post.post_votes.find((v: any) => v.user_id === userId);

        return {
          ...post,
          likes,
          dislikes,
          userVote: userVoteObj?.vote_type ?? null,
        };
      });

      if (shouldReset) {
        setPosts(normalized);
      } else {
        setPosts((prev) => [...prev, ...normalized]);
      }

      setHasMore(data.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);


  useEffect(() => {
    setLoading(true);
    setPosts([]);
    setPage(0);
    setHasMore(true);
    loadPosts(0, true);
  }, [refreshTrigger, loadPosts]);

  useEffect(() => {
    if (page > 0) {
      loadPosts(page);
    }
  }, [page, loadPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading]);

  if (loading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          id={post.id}
          title={post.title}
          email={post.user_email || "Usuário"}
          description={post.description}
          createdAt={post.created_at}
          userId={post.user_id}
          currentUserId={user?.id || ""}
          likes={post.likes}
          dislikes={post.dislikes}
          userVote={post.userVote}
          onDelete={() => handleDeletePost(post)}
          onVote={handleVote}
        />
      ))}

      {hasMore && (
        <div ref={observerTarget} className="py-4">
          <Skeleton className="h-48 w-full" />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="py-8 text-center text-muted-foreground">
          Você chegou ao fim! 🎉
        </p>
      )}
      {posts.length === 0 && !loading && (
        <p className="py-8 text-center text-muted-foreground">
          Nenhum post ainda. Seja o primeiro a postar! 📝
        </p>
      )}
      <AlertDialog
        open={Boolean(postPendingDeletion)}
        onOpenChange={(open) => !open && !isDeleting && setPostPendingDeletion(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir post</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o post "{postPendingDeletion?.title}"? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={confirmDeletePost} disabled={isDeleting}>
                {isDeleting ? "Excluindo..." : "Excluir"}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
