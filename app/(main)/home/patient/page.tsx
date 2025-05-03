"use client";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import PatientFeed from "@/components/PatientFeed";
import { useUserContext } from "@/context/UserContext";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface PostType {
  id: string;
  patient: string;
  content: string;
  createdAt: string;
}

const Home = () => {
  const { userData } = useUserContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [posts, setPosts] = useState<PostType[]>([]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPostContent(e.target.value);
  };

  const handlePostSubmit = async () => {
    if (!newPostContent.trim() || !userData?.email) return;

    const newPost = {
      patient: userData.email,
      content: newPostContent,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, "posts"), newPost);
      setPosts((prevPosts) => [...prevPosts, { ...newPost, id: docRef.id }]);
      setNewPostContent("");
      closeModal();
    } catch (error) {
      console.error("Erro ao adicionar nota ao Firestore:", error);
    }
  };

  useEffect(() => {
    if (!userData?.email) return;

    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "posts");
        const q = query(postsRef, where("patient", "==", userData.email));
        const querySnapshot = await getDocs(q);

        const data: PostType[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as PostType[];

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, [userData]);

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 p-4">
      <div className="w-full md:flex-1 bg-[#EE7B82] p-4 rounded-xl shadow-lg flex flex-col gap-4">
        <h2 className="font-bold text-2xl text-white mb-2">Feed de Paciente</h2>
        <Button
          label="Nova Nota"
          onClick={openModal}
          type="primary"
          size="medium"
        />
        {posts && <PatientFeed posts={posts} />}
      </div>

      {isModalOpen && (
        <div className="absolute inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/10">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3 shadow-xl">
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
