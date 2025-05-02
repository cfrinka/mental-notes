"use client";
import { mockPosts } from "@/mocks/index";
import Post from "./Post";

type PatientFeedProps = {
  selectedPatientId: number | null;
};

const PatientFeed: React.FC<PatientFeedProps> = ({ selectedPatientId }) => {
  const filteredPosts = selectedPatientId
    ? mockPosts.filter((post) => post.patientId === selectedPatientId)
    : [];

  return (
    <div className="h-full flex flex-col">
      {selectedPatientId ? (
        filteredPosts.length > 0 ? (
          <div className="scrollable-feed space-y-4 p-2">
            {filteredPosts.map((post) => (
              <Post
                key={post.id}
                content={post.content}
                createdAt={post.createdAt}
              />
            ))}
          </div>
        ) : (
          <p className="text-[#8A8ADF] italic">Nenhum post encontrado.</p>
        )
      ) : (
        <p className="text-[#8A8ADF] italic">
          Selecione um paciente para ver os posts.
        </p>
      )}
    </div>
  );
};

export default PatientFeed;
