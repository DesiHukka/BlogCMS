import { useState } from "react";

function LoadMoreBtn({ setBlogs, blogs, tag }) {
  const [isDisabled, setIsDisabled] = useState(false);
  const handleLoadMore = () => {
    if (blogs.results.length < blogs.totalDocs) {
      setBlogs({
        ...blogs,

        page: blogs.page + 1,
        activeCategory: tag,
      });
      setIsDisabled(false);
    }
  };
  return (
    <div className="my-8">
      <button
        disabled={isDisabled}
        onClick={() => {
          setIsDisabled(true);
          handleLoadMore();
        }}
        className="px-4 py-2 bg-black text-white rounded-full"
      >
        Load More
      </button>
    </div>
  );
}

export default LoadMoreBtn;
