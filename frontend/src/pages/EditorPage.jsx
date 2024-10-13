import { createContext, useContext, useState } from "react";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import PublishForm from "../components/PublishForm";

export const EditorContext = createContext({});

const blogStructure = {
  banner: "",
  title: "",
  content: {},
  tags: [],
  description: "",
};

function EditorPage() {
  const [blog, setBlog] = useState(blogStructure);
  const [isEditor, setIsEditor] = useState(true);
  const [textEditor, setTextEditor] = useState(null);
  const {
    user: { accessToken },
  } = useContext(UserContext);

  if (!accessToken) {
    return <Navigate to={"/sign-in"} />;
  }
  return (
    <>
      <main className="p-4">
        <EditorContext.Provider
          value={{
            blog,
            setBlog,
            isEditor,
            setIsEditor,
            textEditor,
            setTextEditor,
          }}
        >
          {isEditor ? <Editor /> : <PublishForm />}
        </EditorContext.Provider>
      </main>
    </>
  );
}

export default EditorPage;
