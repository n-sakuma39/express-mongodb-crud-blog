require("dotenv").config();

const express = require("express");
const app = express();
const nodemon = require("nodemon");
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const dbUrl = process.env.DB_URL;

// mongoose接続
mongoose
  .connect(dbUrl)
  .then((res) => app.listen("3000"))
  .catch((err) => console.log(err));

app.get("/create", (req, res) => {
  res.render("create", {
    title: "ブログ投稿",
  });
});

const Blog = require("./models/blogs");

app.post("/", (req, res) => {
  const blog = new Blog(req.body);
  blog
    .save()
    .then((data) => {
      res.redirect("/");
    })
    .catch((err) => console.log(err));
});

app.get("/", (req, res) => {
  Blog.find()
    .then((data) => {
      //console.log(data);
      res.render("index", {
        title: "ブログ一覧",
        blogs: data,
      });
    })
    .catch((err) => console.log(err));
});

app.get("/detail/:id", (req, res) => {
  const blogId = req.params.id;
  Blog.findById(blogId)
    .then((data) => {
      res.render("detail", {
        title: "ブログ詳細ページ",
        blog: data,
      });
    })
    .catch((err) => console.log(err));
});

app.delete("/detail/:id", (req, res) => {
  const blogId = req.params.id;
  Blog.findByIdAndDelete(blogId)
    .then(() => {
      res.json({ redirect: "/" });
    })
    .catch((err) => console.log(err));
});
