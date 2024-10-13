import { useContext, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { EditorContext } from "../pages/EditorPage";
import { toast, ToastContainer } from "react-toastify";
import Tag from "./Tag";
import axios from "axios";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";

function PublishForm() {
  const [navigate, setNavigate] = useState(false);
  const {
    blog: { title, banner, description, tags, content },
    blog,
    setBlog,
    setIsEditor,
  } = useContext(EditorContext);

  const {
    user: { accessToken },
  } = useContext(UserContext);

  const desLimit = 200;
  const tagsLimit = 10;

  const handleCloseBtn = () => {
    setIsEditor(true);
  };

  const handleTagsKey = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      const tag = e.target.value.toLowerCase();
      if (tags.length < tagsLimit && tag.length && !tags.includes(tag)) {
        setBlog({ ...blog, tags: [...tags, tag] });
        e.target.value = "";
      } else {
        toast.error("Tags limit reached or Invalid tag!!!");
      }
    } else return;
  };

  const handleBlogPublish = async () => {
    const dataToSend = { title, banner, description, tags, content };
    const { data } = await axios.post("/create-blog", dataToSend, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const blogId = data.id;
    setNavigate(true);
  };

  if (navigate) {
    return <Navigate to={"/"} />;
  }
  return (
    <div className="relative lg:p-4">
      <ToastContainer />
      <button
        onClick={handleCloseBtn}
        className="absolute right-0 w-12 h-12 text-2xl hover:bg-gray-100 rounded-full flex justify-center items-center"
      >
        <IoMdClose />
      </button>
      <h2 className="mb-4">Preview</h2>

      <div className="mt-8 lg:mt-24 flex flex-col gap-10 w-full lg:flex-row lg:items-start ">
        <div id="metaContainer" className="flex flex-col gap-4 lg:flex-1">
          <div className="aspect-video lg:max-w-screen-md rounded-lg overflow-hidden">
            <img
              src={import.meta.env.VITE_SERVER_STATIC + `${banner}`}
              className="object-cover aspect-video"
            />
          </div>

          <h1 className="leading-tight line-clamp-2">{title}</h1>

          <p className="lg:h-32">{description}</p>
        </div>
        <div id="editContainer" className="flex flex-col gap-4 lg:gap-6 flex-1">
          <h3>Edit Title</h3>
          <input
            type="text"
            className="p-4 border border-gray-500 rounded-lg focus:outline-purple-800 bg-gray-100 focus:bg-white"
            placeholder="Title..."
            value={title}
            onChange={(e) => setBlog({ ...blog, title: e.target.value })}
          />
          <h3>Enter a short description</h3>
          <textarea
            defaultValue={description}
            onChange={(e) => {
              if (desLimit - e.target.value.length >= 0) {
                setBlog({ ...blog, description: e.target.value });
              } else {
                return toast.error("Max Description limit reached!!!");
              }
            }}
            className="resize-none h-32 p-4 border border-gray-500 rounded-lg focus:outline-purple-800 bg-gray-100 focus:bg-white"
            placeholder="Description..."
          ></textarea>
          <p className="text-right text-sm text-gray-600">
            {desLimit - description.length} Characters Left
          </p>
          <p className="-mb-2">
            Enter Tags (used for ranking blogs and improving search)
          </p>
          <div className="w-full flex flex-col gap-2  bg-gray-200 focus:bg-white rounded-lg p-2">
            <input
              type="text"
              className="py-2 px-4 border border-gray-500 focus:outline-purple-800 rounded-lg"
              placeholder="Tags..."
              onKeyDown={handleTagsKey}
            />
            <div className="flex flex-wrap gap-2">
              {tags.length > 0 &&
                tags.map((tag, i) => {
                  return <Tag tag={tag} index={i} key={i} />;
                })}
            </div>
          </div>
          <p className="text-right text-xs text-gray-600">
            {tagsLimit - tags.length} Tags Left
          </p>
          <button
            onClick={handleBlogPublish}
            className="px-6 py-4 w-fit rounded-full bg-black text-white"
            type="submit"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}

export default PublishForm;
