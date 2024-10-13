import { useContext } from "react";
import { IoMdClose } from "react-icons/io";
import { EditorContext } from "../pages/EditorPage";

function Tag({ tag, index }) {
  const {
    blog: { tags },
    blog,
    setBlog,
  } = useContext(EditorContext);

  const handleTagsDelete = (tagName) => {
    const updatedTags = tags.filter((tag) => tag !== tagName);
    setBlog({ ...blog, tags: updatedTags });
  };
  const handleTagEdit = (e) => {
    if (e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      const newTag = e.target.innerText;
      tags[index] = newTag;
      e.target.setAttribute("contentEditable", false);
    }
  };
  const handleTagClick = (e) => {
    e.target.setAttribute("contentEditable", "true");
    e.target.focus();
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-full py-2 px-4">
      <p
        className="outline-none"
        onKeyDown={handleTagEdit}
        onClick={handleTagClick}
      >
        {tag}
      </p>
      <button
        onClick={() => handleTagsDelete(tag)}
        className="rounded-full hover:bg-gray-200 p-1"
      >
        <IoMdClose />
      </button>
    </div>
  );
}

export default Tag;
