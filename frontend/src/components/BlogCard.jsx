import { GoHeart } from "react-icons/go";
import { getDay } from "../utils/getDay";
import { Link } from "react-router-dom";

function BlogCard({ blog, author }) {
  const {
    title,
    description,
    publishedAt,
    tags,
    activity: { total_likes },
    banner,
    blog_id,
  } = blog;
  const { fullName, userName, pic } = author;
  return (
    <Link
      to={`/${blog_id}`}
      className="flex justify-between items-center border-b gap-4"
    >
      <div className="w-3/5 xl:w-4/6 flex flex-col gap-4 mb-8 mt-8">
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
        <h2 className="line-clamp-2 md:line-clamp-1">{title}</h2>
        <p className="hidden md:line-clamp-2">{description}</p>
        <div className="flex gap-8 items-center">
          <span className="px-4 py-2 rounded-full w-fit bg-slate-200 capitalize line-clamp-1">
            {tags[0]}
          </span>
          <span className="flex gap-2 items-center">
            <GoHeart className="text-2xl" />
            {total_likes}
          </span>
        </div>
      </div>
      <div className="lg:mr-8 flex-none aspect-square w-24 md:w-40 md:h-40 bg-gray-100 overflow-hidden">
        <img
          className="aspect-square w-24 md:w-40 md:h-40 object-cover"
          src={import.meta.env.VITE_SERVER_STATIC + `${banner}`}
        />
      </div>
    </Link>
  );
}

export default BlogCard;
