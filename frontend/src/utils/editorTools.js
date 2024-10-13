import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";
import NestedList from "@editorjs/nested-list";
import Checklist from "@editorjs/checklist";
import Embed from "@editorjs/embed";
import Table from "@editorjs/table";
import CodeTool from "@editorjs/code";
import RawTool from "@editorjs/raw";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

export const tools = {
  header: {
    class: Header,
    inlineToolbar: true,
    config: {
      placeholder: "Enter a heading...",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    shortcut: "CMD+SHIFT+O",
    config: {
      quotePlaceholder: "Enter a quote...",
      captionPlaceholder: "Quote's author",
    },
  },
  image: {
    class: ImageTool,
    config: {
      endpoints: {
        byFile: "http://localhost:8080/editor/upload-img", // Your backend file uploader endpoint
        byUrl: "http://localhost:8080/editor/upload-img-url", // Your endpoint that provides uploading by Url
      },
    },
  },
  list: {
    class: NestedList,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true,
  },

  embed: {
    class: Embed,
  },
  table: {
    class: Table,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  },
  code: { class: CodeTool },
  raw: { class: RawTool },
  Marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M",
  },
  inlineCode: {
    class: InlineCode,
    shortcut: "CMD+SHIFT+M",
  },
};
