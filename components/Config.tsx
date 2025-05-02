"use client";
import React, { useState } from "react";

const Config = () => {
  const [configItems] = useState([
    { id: 1, name: "Config 1" },
    { id: 2, name: "Config 2" },
    { id: 3, name: "Config 3" },
  ]);

  return (
    <div className="bg-white p-4 rounded-xl shadow space-y-4">
      <ul className="space-y-2">
        {configItems.map((item) => (
          <li
            key={item.id}
            className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors"
          >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Config;
