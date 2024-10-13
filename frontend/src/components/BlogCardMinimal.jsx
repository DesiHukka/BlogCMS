import React from "react";
import { getDay } from "../utils/getDay";

function BlogCardMinimal({ blog, author, index }) {
  const { title, publishedAt } = blog;
  const { fullName, userName, pic } = author;
  return (
    <div className="flex w-full items-center gap-4 mb-4">
      <div className="text-5xl font-bold text-gray-300">
        {index < 9 ? "0" + (index + 1) : index}
      </div>
      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 bg-gray-100 rounded-full overflow-hidden">
            <img
              className="w-6 h-6 rounded-full object-cover aspect-square"
              src={pic}
            />
          </div>
          <p className="line-clamp-1 text-gray-400">{fullName}</p>
          <p className="line-clamp-1 text-gray-400">@{userName}</p>
          <p className="line-clamp-1 text-gray-400">{getDay(publishedAt)}</p>
        </div>
        <h3 className="line-clamp-2 font-semibold">{title}</h3>
      </div>
    </div>
  );
}

export default BlogCardMinimal;
