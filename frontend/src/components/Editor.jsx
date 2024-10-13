import { RiFileUploadLine } from "react-icons/ri";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import EditorJS from "@editorjs/editorjs";
import { tools } from "../utils/editorTools";
import { EditorContext } from "../pages/EditorPage";
import { ImLeaf } from "react-icons/im";

function Editor() {
  const {
    blog: { banner, title, content, tags, description },
    setBlog,
    blog,
    textEditor,
    setTextEditor,
    setIsEditor,
  } = useContext(EditorContext);

  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holder: "textEditor",
        data: content,
        placeholder: `Let's write an awesome blog...`,
        tools: tools,
      })
    );
  }, []);

  const handleBannerUpload = async (e) => {
    const files = e.target.files;
    if (!files) {
      return;
    }
    const formData = new FormData();
    for (let file of files) {
      formData.append("bannerImg", file);
    }

    const { data } = await toast.promise(
      axios.post("/upload-img", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }),
      {
        pending: "Uploading Banner...",
        success: "Banner Uploaded 👌",
        error: "Banner Uplaod Failed 🤯",
      }
    );

    if (data) {
      setBlog({ ...blog, banner: data.filename });
    }
  };

  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = input.scrollHeight + "px";
    setBlog({ ...blog, title: input.value });
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == "13") {
      e.preventDefault();
    }
  };

  const handleBlogPublish = async () => {
    if (!banner) {
      return toast.error("Please upload the banner image!!!");
    }
    if (!title.length) {
      return toast.error("Write Title for the blog!!!");
    }

    const data = await textEditor.save();
    if (data.blocks.length) {
      setBlog({ ...blog, content: data });
    } else {
      return toast.error("Your Blog is empty!!!");
    }

    setIsEditor(false);
  };

  return (
    <>
      <nav className="relative flex items-center min-h-20 px-8 py-4 md:p-1 md:px-4 border-b-4">
        <div className="w-12 h-12 flex items-center md:ml-6">
          <ImLeaf className="text-3xl" />
        </div>
        <div className="flex-1 flex gap-4 justify-end items-center">
          <button
            onClick={handleBlogPublish}
            className="h-12 bg-black hover:bg-gray-600 text-white px-4 py-2 rounded-xl"
          >
            Publish
          </button>
          <button className="h-12 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-xl">
            Save Draft
          </button>
        </div>
      </nav>
      <div className="w-full max-w-[900px] mt-4 mx-auto flex flex-col justify-center gap-4">
        <div className="aspect-video border-4">
          <ToastContainer />
          <label className="">
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              name="bannerImg"
              onChange={handleBannerUpload}
              hidden
            />
            {!banner ? (
              <div className="bg-white aspect-video flex flex-col gap-2 justify-center items-center text-5xl z-50 hover:cursor-pointer hover:bg-gray-50">
                <RiFileUploadLine className="text-gray-400" />
                <span className="text-lg text-gray-500">Upload Banner</span>
              </div>
            ) : (
              <img
                src={import.meta.env.VITE_SERVER_STATIC + `${banner}`}
                className="object-cover aspect-video z-50"
              />
            )}
          </label>
        </div>
        <textarea
          placeholder="Blog Title"
          className=" text-4xl font-medium resize-none outline-none"
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
        ></textarea>
        <hr />
        <div id="textEditor" className=""></div>
      </div>
    </>
  );
}

export default Editor;
