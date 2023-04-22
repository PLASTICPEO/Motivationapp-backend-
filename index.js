require("dotenv").config();
const express = require("express");
const app = express();
const Quote = require("./models/quote");
const Admin = require("./models/admin");

const cors = require("cors");

const path = require("path");

app.use(express.json());

app.use(cors());

app.use(express.static("dist"));

const mongoose = require("mongoose");
const pass = process.env.password;

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = `mongodb+srv://quote-app:quoteapp@plastic-db.djoer9l.mongodb.net/QuotesApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

app.get("/api/compliments", (req, res) => {
  Quote.find({}).then((quotes) => {
    res.status(200).send(quotes.filter((quote) => quote.approved));
  });
});

app.post("/api/compliments/create", (req, res) => {
  const body = req.body;

  if (!body.text) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const color = getRandomColor();

  const compliment = {
    text: body.text,
    author: body.author,
    color: color,
    approved: false,
  };

  Quote.create(compliment)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  res.end();
});

app.post("/api/compliments/approve/:id", (req, res) => {
  const { id } = req.params;

  Quote.findByIdAndUpdate(id, { approved: true })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  res.end();
});

app.delete("/api/compliments/remove/:id", (req, res) => {
  const { id } = req.params;

  Quote.findByIdAndRemove(id)
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

  res.end();
});

app.get("/api/admins", (request, response) => {
  Admin.find({}).then((admins) => {
    response.json(admins);
  });
});

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
