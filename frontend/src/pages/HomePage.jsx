import React, { useEffect, useState } from "react";
import InPageNav from "../components/InPageNav";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import BlogCard from "../components/BlogCard";
import BlogCardMinimal from "../components/BlogCardMinimal";
import LoadMoreBtn from "../components/LoadMoreBtn";
import Loader from "../utils/Loader";

let randomCategories = [];

function HomePage() {
  const [blogs, setBlogs] = useState({
    results: [],
    page: 1,
    totalDocs: null,
    activeCategory: "home",
  });
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchBlogs = async () => {
    await axios
      .post("/latest-blogs", {
        page: blogs.page,
        tag: blogs.activeCategory,
        query: null,
      })
      .then(({ data }) =>
        setBlogs({
          ...blogs,
          results: [...blogs.results, ...data.blogs],
          totalDocs: data.count,
        })
      )
      .catch(({ response }) => toast.error(response.data.error));
  };

  const fetchTrendingBlogs = () => {
    axios
      .get("/trending-blogs")
      .then(({ data: { blogs } }) => setTrendingBlogs([...blogs]))
      .catch(({ response }) => toast.error(response.data.error));
  };

  const getAllCategories = async () => {
    await axios
      .get("/all-tags")
      .then(({ data }) => setCategories([...data]))
      .catch(({ response }) => toast.error(response.data.error));
  };

  useEffect(() => {
    fetchBlogs();
    if (!trendingBlogs.length) {
      fetchTrendingBlogs();
    }
    if (!categories.length) {
      getAllCategories();
    }
  }, [blogs.activeCategory, blogs.page]);

  if (!categories.length) {
    return <Loader />;
  }

  if (!randomCategories.length) {
    for (let i = 0; i < 10; i++) {
      const random = Math.floor(Math.random() * categories.length);
      randomCategories.push(categories[random]);
    }
  }

  const handleCategoryClick = (category) => {
    setBlogs({
      activeCategory: category,
      results: [],
      totalDocs: null,
      page: 1,
    });
    if (blogs.activeCategory == category) {
      return setBlogs({
        activeCategory: "home",
        results: [],
        totalDocs: null,
        page: 1,
      });
    }
  };

  return (
    <section className="w-full flex px-8 lg:pl-32 lg:pr-20 xl:px-32 gap-4">
      <div className="lg:w-3/5 xl:w-2/3 flex flex-col gap-8">
        <ToastContainer />
        <InPageNav
          buttons={[blogs.activeCategory, "trending blogs"]}
          defaultHidden={"trending blogs"}
          activeCategory={blogs.activeCategory}
        >
          <>
            {blogs.results.map((blog, i) => (
              <BlogCard key={i} blog={blog} author={blog.author} />
            ))}
            {blogs.results.length < blogs.totalDocs && (
              <LoadMoreBtn
                setBlogs={setBlogs}
                tag={blogs.activeCategory}
                blogs={blogs}
              />
            )}
          </>
          {trendingBlogs.map((blog, i) => (
            <BlogCardMinimal
              key={i}
              blog={blog}
              author={blog.author}
              index={i}
            />
          ))}
        </InPageNav>
      </div>
      <div className="hidden lg:flex-1 border-l-2 py-4 pl-8 lg:flex flex-col gap-16">
        <div className="flex flex-col gap-8 mt-8">
          <span className="text-xl font-semibold">
            Stories from all interests
          </span>
          <div className="flex gap-4 flex-wrap">
            {randomCategories?.map((category, i) => (
              <button
                onClick={() => handleCategoryClick(category)}
                key={i}
                className={`py-2 px-4 capitalize rounded-full ${
                  blogs.activeCategory == category
                    ? "bg-black text-white"
                    : "bg-slate-200 text-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-8">
          <span className="text-xl font-semibold">Trending Blogs</span>
          {trendingBlogs.map((blog, i) => (
            <BlogCardMinimal
              key={i}
              blog={blog}
              author={blog.author}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
