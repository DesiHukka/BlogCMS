import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../utils/Loader";
import { TiHeartOutline } from "react-icons/ti";
import { FaRegCommentDots } from "react-icons/fa6";
import { UserContext } from "../App";
import { FaSquareXTwitter } from "react-icons/fa6";
import BlogCard from "../components/BlogCard";
import NoDataMessage from "../utils/NoDataMessage";
import BlogContent from "../components/BlogContent";
function BlogPage() {
  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState(null);
  const { blogId } = useParams();
  const { timeStamp } = useParams();
  const {
    user: { id: loggedUserId },
  } = useContext(UserContext);

  const fetchBlogDetails = () => {
    axios
      .post("/get-blog", { blog_id: `${timeStamp}/${blogId}` })
      .then(({ data }) => {
        setBlog({ ...data });
        fetchSimilarBlogs(data.tags[0]);
      })
      .catch(({ response }) => toast.error(response.data.error));
  };

  const fetchSimilarBlogs = (tag) => {
    axios
      .post("/similar-blogs", { tag, blog_id: `${timeStamp}/${blogId}` })
      .then(({ data: { blogs } }) => setSimilarBlogs([...blogs]))
      .catch(({ response }) => toast.error(response.data.error));
  };

  useEffect(() => {
    fetchBlogDetails();
  }, [blogId]);

  if (!blog) {
    return <Loader />;
  }

  const {
    title,
    banner,
    description,
    content,
    tags,
    activity: { total_likes, total_comments },
    author: { fullName, userName, pic, _id: authorId },
  } = blog;

  return (
    <div className="w-full lg:w-5/6 mx-auto flex flex-col p-8 lg:px-32 gap-4">
      <div className="w-full lg:w-4/6 mx-auto aspect-square lg:aspect-video bg-gray-200 overflow-hidden">
        <img
          src={import.meta.env.VITE_SERVER_STATIC + `${banner}`}
          className="w-full aspect-square lg:aspect-video object-cover"
        />
      </div>
      <h1>{title}</h1>
      <div className="flex gap-6 items-center">
        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
          <img src={pic} className="w-12 h-12 rounded-full object-cover" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-center text-sm">{fullName}</span>
          <span>
            @
            <Link to={`/user/${authorId}`} className="underline">
              {userName}
            </Link>
          </span>
        </div>
      </div>
      <hr className="border border-gray-200" />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gray-200">
            <TiHeartOutline className="text-2xl" />
          </div>
          <span>{total_likes}</span>
          <div className="p-2 rounded-full bg-gray-200">
            <FaRegCommentDots className="text-xl" />
          </div>
          <span>{total_comments}</span>
        </div>
        <div className="flex items-center gap-4">
          {authorId === loggedUserId && (
            <button className="px-2 py-1 rounded-lg bg-slate-200">Edit</button>
          )}
          <Link to={``}>
            <FaSquareXTwitter className="text-gray-600 hover:text-black text-2xl" />
          </Link>
        </div>
      </div>
      <hr className="border border-gray-200" />
      {content[0].blocks.map((block, i) => {
        return <BlogContent key={i} type={block.type} data={block.data} />;
      })}

      <hr className="border border-gray-200" />
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-gray-200">
            <TiHeartOutline className="text-2xl" />
          </div>
          <span>{total_likes}</span>
          <div className="p-2 rounded-full bg-gray-200">
            <FaRegCommentDots className="text-xl" />
          </div>
          <span>{total_comments}</span>
        </div>
        <div className="flex items-center gap-4">
          {authorId === loggedUserId && (
            <button className="px-2 py-1 rounded-lg bg-slate-200">Edit</button>
          )}
          <Link to={``}>
            <FaSquareXTwitter className="text-gray-600 hover:text-black text-2xl" />
          </Link>
        </div>
      </div>
      <hr className="border border-gray-200" />
      <div className="mt-8">
        <h2>Similar Blogs</h2>
        {!similarBlogs ? (
          <Loader />
        ) : similarBlogs.length ? (
          similarBlogs.map((blog) => (
            <BlogCard blog={blog} author={blog.author} />
          ))
        ) : (
          <NoDataMessage message={"No Similar Blogs Found..."} />
        )}
      </div>
    </div>
  );
}

export default BlogPage;
