import React from "react";

function BlogContent({ type, data }) {
  if (type == "header") {
    if (data.level == 2)
      return <h2 dangerouslySetInnerHTML={{ __html: data.text }}></h2>;
    if (data.level == 3)
      return <h3 dangerouslySetInnerHTML={{ __html: data.text }}></h3>;
    if (data.level == 4)
      return <h4 dangerouslySetInnerHTML={{ __html: data.text }}></h4>;
  }
  if (type == "paragraph") {
    return <p dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }
  if (type == "list") {
    return (
      <ol
        className={`list-outside ${
          data.style == "unordered" ? "list-disc" : "list-decimal"
        }`}
      >
        {data.items.map((list) => (
          <li dangerouslySetInnerHTML={{ __html: list.content }}></li>
        ))}
      </ol>
    );
  }
  if (type == "image") {
    return (
      <div>
        <div className="lg:w-1/2 aspect-video mx-auto bg-gray-200 overflow-hidden">
          <img src={data.file.url} className="aspect-video object-cover" />
        </div>
        {data.caption.length && (
          <p className="lg:w-1/2 mx-auto my-3 text-center text-gray-500">
            {data.caption}
          </p>
        )}
      </div>
    );
  }
  if (type == "quote") {
    return (
      <div className="p-3 pl-5 bg-purple-200 border-l-4 border-purple-700">
        <p
          className="text-xl md:text-2xl "
          dangerouslySetInnerHTML={{ __html: data.text }}
        ></p>
        {data.caption.length && (
          <p className="text-purple-700">{data.caption}</p>
        )}
      </div>
    );
  }
  if (type == "embed") {
    return (
      <div>
        <iframe
          width={data.width}
          height={data.height}
          src={data.embed}
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        {data.caption.length && (
          <p className="my-3 text-center text-gray-500">{data.caption}</p>
        )}
      </div>
    );
  }
}

export default BlogContent;
