import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import InPageNav, { activeBtn } from "../components/InPageNav";
import { UserContext } from "../App";
import axios from "axios";
import Loader from "../utils/Loader";
import BlogCard from "../components/BlogCard";
import LoadMoreBtn from "../components/LoadMoreBtn";
import NoDataMessage from "../utils/NoDataMessage";
import { SiYoutube } from "react-icons/si";
import { RiInstagramFill } from "react-icons/ri";
import { FaSquareFacebook } from "react-icons/fa6";
import { SiGithub } from "react-icons/si";
import { FaSquareXTwitter } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import { getFullDay } from "../utils/getDay";
function UserPage() {
  const [blogs, setBlogs] = useState({
    results: [],
    page: 1,

    totalDocs: null,
  });

  const [userDetails, setUserDetails] = useState(null);
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const loggedUserId = user.id;

  useEffect(() => {
    fetchBlogs();
    fetchUserDetails();
  }, [id, blogs.page]);

  const fetchBlogs = async () => {
    await axios
      .post("/latest-blogs", {
        page: blogs.page,
        author: id,
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

  const fetchUserDetails = () => {
    axios
      .post("/fetch-user", { id })
      .then(({ data: { user } }) => setUserDetails({ ...user }))
      .catch(({ response }) => toast.error(response.data.error));
  };
  if (!userDetails) {
    return <Loader />;
  }

  const socialsArray = Object.keys(userDetails.social_links);

  const getSocialIcon = (socialMedia) => {
    switch (socialMedia) {
      case "youtube":
        return (
          <Link to={`${userDetails.social_links[socialMedia]}`}>
            <SiYoutube className="text-gray-600 hover:text-black text-2xl" />
          </Link>
        );
      case "instagram":
        return (
          <Link to={`${userDetails.social_links[socialMedia]}`}>
            <RiInstagramFill className="text-gray-600 hover:text-black text-2xl" />
          </Link>
        );
      case "github":
        return (
          <Link to={`${userDetails.social_links[socialMedia]}`}>
            <SiGithub className="text-gray-600 hover:text-black text-2xl" />
          </Link>
        );
      case "facebook":
        return (
          <Link to={`${userDetails.social_links[socialMedia]}`}>
            <FaSquareFacebook className="text-gray-600 hover:text-black text-2xl" />
          </Link>
        );
      case "twitter":
        return (
          <Link to={`${userDetails.social_links[socialMedia]}`}>
            <FaSquareXTwitter className="text-gray-600 hover:text-black text-2xl" />
          </Link>
        );
      case "website":
        return (
          <Link to={`${userDetails.social_links[socialMedia]}`}>
            <LuGlobe className="text-gray-600 hover:text-black text-2xl" />
          </Link>
        );
    }
  };

  return (
    <main className="flex flex-col items-center gap-8 mt-8 lg:mt-0">
      <section className="lg:hidden flex flex-col gap-4">
        <div className="w-36 h-36 rounded-full bg-slate-200 overflow-hidden">
          <img
            src={userDetails?.pic}
            className="w-36 h-36 rounded-full aspect-square object-cover"
          />
        </div>
        <h3 className="text-gray-500 text-center">@{userDetails?.userName}</h3>
        <h2 className="text-center">{userDetails?.fullName}</h2>
        <p className="text-center">
          {userDetails?.blogs?.length} Blogs -{" "}
          {userDetails?.account_info?.total_reads} Reads
        </p>
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
          Edit
        </button>
      </section>
      <section className="w-full flex px-8 lg:pl-32 lg:pr-20 xl:px-32 gap-4">
        <div className="w-full lg:w-3/5 xl:w-2/3 flex flex-col gap-8">
          <ToastContainer />
          <InPageNav
            buttons={[`Published Blogs`, "About"]}
            defaultHidden={"About"}
            activeCategory={activeBtn}
          >
            <>
              {blogs.results.length ? (
                blogs.results.map((blog, i) => (
                  <BlogCard key={i} blog={blog} author={blog.author} />
                ))
              ) : (
                <Loader />
              )}
              {blogs.results?.length < blogs.totalDocs && (
                <LoadMoreBtn
                  setBlogs={setBlogs}
                  tag={blogs.activeCategory}
                  blogs={blogs}
                />
              )}
            </>
            <div className="w-full flex gap-4 flex-col items-center flex-wrap">
              {userDetails?.bio ? (
                <div>{userDetails.bio}</div>
              ) : (
                <NoDataMessage message={"Nothing to read here"} />
              )}
              <div className="flex flex-wrap gap-4">
                {socialsArray.map((socialAccount) => {
                  if (userDetails.social_links[socialAccount])
                    return getSocialIcon(socialAccount);
                })}
              </div>
              <div>
                <p>Joined on {getFullDay(userDetails.joinedAt)}</p>
              </div>
            </div>
          </InPageNav>
        </div>
        <section className="hidden lg:flex-1 border-l-2 py-8 pl-12 lg:flex flex-col items-center gap-12">
          <div className="flex flex-col gap-4">
            <div className="w-36 h-36 rounded-full bg-slate-200 overflow-hidden">
              <img
                src={userDetails?.pic}
                className="w-36 h-36 rounded-full aspect-square object-cover"
              />
            </div>
            <h3 className="text-gray-500 text-center">
              @{userDetails?.userName}
            </h3>
            <h2 className="text-center">{userDetails?.fullName}</h2>
            <p className="text-center">
              {userDetails?.blogs?.length} Blogs -{" "}
              {userDetails?.account_info?.total_reads} Reads
            </p>
            {loggedUserId === id && (
              <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">
                Edit
              </button>
            )}
          </div>

          <div className="w-full flex gap-4 flex-col items-center flex-wrap">
            <span className="font-semibold">
              More About {userDetails.fullName}:
            </span>
            {userDetails?.bio ? (
              <div>{userDetails.bio}</div>
            ) : (
              <NoDataMessage message={"Nothing to read here"} />
            )}
            <div className="flex flex-wrap gap-4">
              {socialsArray.map((socialAccount) => {
                if (userDetails.social_links[socialAccount])
                  return getSocialIcon(socialAccount);
              })}
            </div>
            <div>
              <p>Joined on {getFullDay(userDetails.joinedAt)}</p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

export default UserPage;
