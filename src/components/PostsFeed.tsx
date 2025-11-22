import { useEffect, useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PostCard } from "./PostCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Post {
  id: string;
  title: string;
  description: string;
  created_at: string;
  profiles: {
    username: string;
  };
}

const POSTS_PER_PAGE = 10;

export const PostsFeed = ({ refreshTrigger }: { refreshTrigger: number }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const observerTarget = useRef<HTMLDivElement>(null);

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
          profiles (
            username
          )
        `)
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      if (data) {
        if (shouldReset) {
          setPosts(data as Post[]);
        } else {
          setPosts((prev) => [...prev, ...(data as Post[])]);
        }
        setHasMore(data.length === POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error("Erro ao carregar posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);

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
          title={post.title}
          description={post.description}
          username={post.profiles?.username || "Usuário"}
          createdAt={post.created_at}
        />
      ))}
      {hasMore && (
        <div ref={observerTarget} className="py-4">
          <Skeleton className="h-48 w-full" />
        </div>
      )}
      {!hasMore && posts.length > 0 && (
        <p className="text-center text-muted-foreground py-8">
          Você chegou ao fim! 🎉
        </p>
      )}
      {posts.length === 0 && !loading && (
        <p className="text-center text-muted-foreground py-8">
          Nenhum post ainda. Seja o primeiro a postar! 📝
        </p>
      )}
    </div>
  );
};