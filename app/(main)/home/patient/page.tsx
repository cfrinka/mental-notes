"use client";
import { useState } from "react";
import Button from "@/components/Button";
import PatientFeed from "@/components/PatientFeed";
import { useUserContext } from "@/context/UserContext";

const Home = () => {
  const { userData } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState([
    {
      id: 1,
      patientId: 1,
      content: "I felt overwhelmed today, but journaling helped calm me down.",
      createdAt: "2025-04-30T10:15:00Z",
    },
  ]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPostContent(e.target.value);
  };

  const handlePostSubmit = () => {
    if (newPostContent.trim()) {
      const newPost = {
        id: posts.length + 1,
        patientId: 1,
        content: newPostContent,
        createdAt: new Date().toISOString(),
      };
      setPosts((prevPosts) => [...prevPosts, newPost]);
      setNewPostContent("");
      closeModal();
    }
  };

  console.log("patient", userData);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:flex-1 bg-[#EE7B82] p-4 rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-[#fff] mb-2">
          Feed de Paciente
        </h2>
        <Button
          label={"Nova Nota"}
          onClick={openModal}
          type={"primary"}
          size={"medium"}
        />
        <PatientFeed selectedPatientId={1} />
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="absolute inset-0 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-1/3">
            <h2 className="font-bold text-xl mb-4 text-[#8A8ADF]">Nova Nota</h2>
            <input
              type="text"
              value={newPostContent}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md mb-4 text-[#8A8ADF]"
              placeholder="Escreva sua nova nota aqui..."
            />
            <div className="flex justify-between">
              <Button
                label="Cancelar"
                onClick={closeModal}
                type="secondary"
                size="small"
              />
              <Button
                label="Salvar"
                onClick={handlePostSubmit}
                type="primary"
                size="small"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
