import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import InPageNav from "../components/InPageNav";
import axios from "axios";
import LoadMoreBtn from "../components/LoadMoreBtn";
import BlogCard from "../components/BlogCard";
import UserCard from "../components/UserCard";
import NoDataMessage from "../utils/NoDataMessage";

function SearchPage() {
  const [blogs, setBlogs] = useState({
    results: [],
    page: 1,
    totalDocs: null,
    activeCategory: "home",
  });

  const [users, setUsers] = useState([]);

  const { query } = useParams();

  useEffect(() => {
    fetchUsers();
    axios
      .post("/latest-blogs", {
        page: 1,
        tag: query,
        query: query,
      })
      .then(({ data }) =>
        setBlogs({
          results: [...data.blogs],
          page: 1,
          totalDocs: data.count,
          activeCategory: query,
        })
      )
      .catch(({ response }) => toast.error(response.data.error));
  }, [query]);

  useEffect(() => {
    console.log("page change");
    if (blogs.page !== 1)
      axios
        .post("/latest-blogs", {
          page: blogs.page,
          tag: query,
          query: query,
        })
        .then(({ data }) =>
          setBlogs({
            ...blogs,
            results: [...blogs.results, ...data.blogs],
            totalDocs: data.count,
            activeCategory: query,
          })
        )
        .catch(({ response }) => toast.error(response.data.error));
  }, [blogs.page]);

  const fetchUsers = () => {
    axios
      .post("/get-users", { query })
      .then(({ data: { users } }) => setUsers([...users]))
      .catch(({ response }) => toast.error(response.data.error));
  };

  return (
    <section className="w-full flex px-8 lg:pl-32 lg:pr-20 xl:px-32 gap-4">
      <div className="lg:w-3/5 xl:w-2/3 flex flex-col gap-8">
        <ToastContainer />
        <InPageNav
          buttons={[`Results for ${query}`, "Matched Accounts"]}
          defaultHidden={"Matched Accounts"}
          activeCategory={query}
        >
          <>
            {blogs.results.length ? (
              blogs.results.map((blog, i) => (
                <BlogCard key={i} blog={blog} author={blog.author} />
              ))
            ) : (
              <NoDataMessage
                message={`No blogs found for search term '${query}'`}
              />
            )}
            {blogs.results.length < blogs.totalDocs && (
              <LoadMoreBtn
                setBlogs={setBlogs}
                tag={blogs.activeCategory}
                blogs={blogs}
              />
            )}
          </>
          <div className="flex gap-8 flex-wrap">
            {users.map((user, i) => (
              <UserCard key={i} user={user} />
            ))}
          </div>
        </InPageNav>
      </div>
      <div className="hidden lg:h-screen lg:flex-1 border-l-2 py-4 pl-8 lg:flex flex-col gap-16">
        <div className="flex-1 flex flex-col gap-8 mt-8">
          <span className="text-xl font-semibold">
            Users related to the search
          </span>
          {users.length ? (
            users.map((user, i) => <UserCard key={i} user={user} />)
          ) : (
            <NoDataMessage message={"No users with that name"} />
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchPage;
