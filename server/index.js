import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import cors from "cors";
import bcrypt from "bcrypt";
import UserModel from "./models/UserModel.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import download from "image-downloader";
import path from "path";
import { fileURLToPath } from "url";
import { error } from "console";
import { BlogModel } from "./models/BlogModel.js";
import { title } from "process";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

const app = express();
const PORT = 8080;
const emailRegex =
  /^[a-zA-Z0-9]+([._-][0-9a-zA-Z]+)*@[a-zA-Z0-9]+([.-][0-9a-zA-Z]+)*\.[a-zA-Z]{2,}$/;

mongoose
  .connect(process.env.DB_URI)
  .then(() => console.log("database connected"))
  .catch((err) => console.log(err.message));

const emailValidate = (email) => {
  return emailRegex.test(email);
};
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const sendData = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  return {
    accessToken,
    userName: user.userName,
    fullName: user.fullName,
    pic: user.pic,
    id: user._id,
  };
};
const blogId = (title) => {
  const id = title
    .replace(/[^a-zA-Z0-9]/g, " ")
    .trim()
    .replace(/\s+/g, "-");

  const blogId = Date.now() + "/" + id;
  return blogId;
};

const maxPosts = 4; //Posts to show after hitting '/latest-blogs'

//All Tags Array for SidePanel
let allTags = [];

// Middleware for JWT verification
const verifyUser = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "You are not logged in to access this route!!!" });
  }
  if (accessToken) {
    jwt.verify(accessToken, process.env.JWT_SECRET, (error, user) => {
      if (error) {
        return res.status(403).json({ error: "accessToken is invalid!!!" });
      }
      req.user = user.id;
    });
  }
  next();
};

// Defining Storage for Multer (image uploads)
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-" + Math.round(Math.random() * 999) + ".png";
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

app.post("/upload-img", upload.single("bannerImg"), function (req, res, next) {
  // req.file is the `bannerImg` file
  // req.body will hold the text fields, if there were any
  res.json(req.file);
});

app.post(
  "/editor/upload-img",
  upload.single("image"),
  function (req, res, next) {
    res.json({
      success: 1,
      file: {
        url: `http://localhost:8080/uploads/${req.file.filename}`,
        // ... and any additional fields you want to store, such as width, height, color, extension, etc
      },
    });
  }
);

app.post("/editor/upload-img-url", async (req, res) => {
  const { url } = req.body;
  const imageName = `${Date.now()}.jpg`;
  await download.image({
    url,
    dest: `${__dirname}/uploads/${imageName}`,
  });
  res.json({
    success: 1,
    file: {
      url: `http://localhost:8080/uploads/${imageName}`,
      // ... and any additional fields you want to store, such as width, height, color, extension, etc
    },
  });
});

app.post("/sign-up", (req, res) => {
  const { fullName, email, password } = req.body;
  if (fullName.length < 3) {
    res
      .status(403)
      .json({ error: "Full Name can't be less than 3 characters!" });
  }
  if (!email) {
    res.status(403).json({ error: "Email Field can't be Empty!!!" });
  }
  if (email) {
    const isValidEmail = emailValidate(email);

    if (!isValidEmail) {
      return res.status(403).json({ error: "Invalid Email !!!" });
    }
  }
  if (password.length < 6) {
    res
      .status(403)
      .json({ error: "Password must be atleast 6 characters long!!!" });
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    try {
      let userName = email.split("@")[0];
      const userNameNotUnique = await UserModel.exists({ userName });
      if (userNameNotUnique) {
        const randNum = Math.floor(Math.random() * 999);
        userName += randNum;
      }

      const userData = await UserModel.create({
        fullName,
        userName,
        email,
        password: hashedPassword,
        pic: `https://picsum.photos/seed/${userName}/250/250`,
      });
      res.json(sendData(userData));
    } catch (error) {
      if (error.code == 11000) {
        res.status(500).json({ error: "email already exists!!!" });
      }
    }
  });
});

app.post("/sign-in", (req, res) => {
  const { email, password } = req.body;
  UserModel.findOne({ email })
    .then((user) => {
      if (!user) {
        res.status(403).json({ error: "email does not exist!!!" });
      }
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (!result) {
            res.status(403).json({ error: "Password entered is wrong!!!" });
          }
          if (result) {
            // email and password both correct upto here
            res.json(sendData(user));
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res
        .status(500)
        .json({ error: "Something went wrong, please try again later..." });
    });
});

app.post("/latest-blogs", async (req, res) => {
  let blogs = [];
  let filterQuery = {};
  const { tag, page, author, query } = req.body;
  if (tag) {
    let lowerTag = tag.toLowerCase();
    lowerTag === "home"
      ? (filterQuery = { draft: false })
      : (filterQuery = { draft: false, tags: lowerTag });
  }

  if (query) {
    filterQuery = { draft: false, title: new RegExp(query, "i") };
  }

  if (author) {
    filterQuery = { draft: false, author };
  }

  await BlogModel.find(filterQuery)
    .populate("author", "fullName userName pic -_id")
    .sort({ publishedAt: -1 })
    .skip((page - 1) * maxPosts)
    .select("blog_id title description tags banner activity publishedAt -_id")
    .limit(maxPosts)
    .then((blogsArr) => (blogs = [...blogsArr]))
    .catch((err) => res.status(500).json({ error: err.message }));

  BlogModel.countDocuments(filterQuery)
    .then((count) => res.status(200).json({ blogs, count }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/total-blogs", (req, res) => {
  let filterQuery = {};
  const { tag } = req.body;
  let lowerTag = tag.toLowerCase();
  lowerTag === "home"
    ? (filterQuery = { draft: false })
    : (filterQuery = { draft: false, tags: lowerTag });
  BlogModel.countDocuments(filterQuery)
    .then((count) => res.status(200).json({ count }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/all-tags", (req, res) => {
  BlogModel.find({ draft: false })
    .select("tags -_id")
    .then((tags) => {
      allTags = [];
      tags.map((tag) => {
        allTags = [...allTags, ...tag.tags];
      });
      res.status(200).json(allTags);
    });
});

app.get("/trending-blogs", (req, res) => {
  BlogModel.find({ draft: false })
    .populate("author", "fullName userName pic -_id")
    .sort({
      "activity.total_reads": -1,
      "activity.total_likes": -1,
      publishedAt: -1,
    })
    .select("blog_id title activity publishedAt -_id")
    .limit(5)
    .then((blogs) => res.status(200).json({ blogs }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/fetch-user", (req, res) => {
  const { id } = req.body;
  UserModel.findOne({ _id: id })
    .then((user) => res.status(200).json({ user }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/get-users", (req, res) => {
  const { query } = req.body;
  UserModel.find({ userName: new RegExp(query, "i") })
    .limit(50)
    .populate("blogs", "-author -_id")
    .select("-password -google_auth ")
    .then((users) => res.status(200).json({ users }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/create-blog", verifyUser, async (req, res) => {
  const { title, banner, description, tags, content, draft } = req.body;
  if (!title.length) {
    return res.status(403).json({ error: "No Title Provided" });
  }
  if (!banner?.length) {
    return res.status(403).json({ error: "No Banner Image Provided" });
  }
  if (!description?.length) {
    return res.status(403).json({ error: "No Description Provided" });
  }
  if (!tags?.length) {
    return res.status(403).json({ error: "No Tags Provided" });
  }
  if (!content.blocks?.length) {
    return res.status(403).json({ error: "No Blog Content Provided" });
  }

  const lowerTags = tags.map((tag) => {
    return tag.toLowerCase();
  });

  const author = req.user;
  const blog_id = blogId(title);
  const blog = await BlogModel.create({
    title,
    banner,
    description,
    author,
    tags: lowerTags,
    content,
    draft: Boolean(draft),
    blog_id,
  });

  const incrementBlogCoount = draft ? 0 : 1;
  await UserModel.findOneAndUpdate(
    { _id: author },
    {
      $inc: { "account_info.totalPosts": incrementBlogCoount },
      $push: { blogs: blog._id },
    }
  );
  res.json({ id: blog_id });
});
app.post("/get-blog", (req, res) => {
  const { blog_id } = req.body;
  const incVal = 1;
  BlogModel.findOneAndUpdate(
    { blog_id },
    { $inc: { "activity.total_reads": incVal } }
  )
    .populate("author", "fullName userName pic")
    .then((blog) => {
      UserModel.findOneAndUpdate(
        { userName: blog.author.userName },
        { $inc: { "account_info.total_reads": incVal } }
      ).catch((err) => res.status(500).json({ error: err.message }));
      res.status(200).json(blog);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.post("/similar-blogs", async (req, res) => {
  let filterQuery = {};
  const { tag, blog_id } = req.body;

  if (tag) {
    let lowerTag = tag.toLowerCase();
    lowerTag === "home"
      ? (filterQuery = { draft: false })
      : (filterQuery = {
          draft: false,
          tags: lowerTag,
          blog_id: { $ne: blog_id },
        });
  }

  await BlogModel.find(filterQuery)
    .populate("author", "fullName userName pic -_id")
    .sort({ publishedAt: -1 })
    .select("blog_id title description tags banner activity publishedAt -_id")
    .limit(5)
    .then((blogs) => res.status(200).json({ blogs }))
    .catch((err) => res.status(500).json({ error: err.message }));
});

app.get("/", (req, res) => {
  res.json({ Server: "I am Server" });
});

app.listen(PORT, () => console.log(`Server connected at Port ${PORT}`));
