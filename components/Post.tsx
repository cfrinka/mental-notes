import React from "react";

type PostProps = {
  content: string;
  createdAt: string;
};

const Post: React.FC<PostProps> = ({ content, createdAt }) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="bg-[#FDC768] p-5 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-200">
      <p className="text-[#8A8ADF] text-base mb-3 leading-relaxed font-bold">
        {content}
      </p>
      <div className="text-sm text-[#EE7B82] border-t pt-3 mt-4 flex justify-between items-center">
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default Post;
