"use client";
import Post from "./Post";
import { PostType } from "@/app/(main)/home/patient/page";

type PatientFeedProps = {
  posts: PostType[];
};

const PatientFeed: React.FC<PatientFeedProps> = ({ posts }) => {
  const sortedPosts = posts
    ? [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  return (
    <div className="h-full flex flex-col gap-4 max-h-[500px] overflow-y-auto pr-2 scrollable-feed">
      {sortedPosts.length > 0 ? (
        sortedPosts.map((post) => (
          <Post
            key={post.id}
            content={post.content}
            createdAt={post.createdAt}
          />
        ))
      ) : (
        <p className="text-[#8A8ADF] italic">
          Nenhum post encontrado para este paciente.
        </p>
      )}
    </div>
  );
};

export default PatientFeed;
