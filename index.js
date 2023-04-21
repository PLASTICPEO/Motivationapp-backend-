require("dotenv").config();
const express = require("express");
const app = express();
const Quote = require("./models/quote");

const cors = require("cors");

const path = require("path");

app.use(express.json());

app.use(cors());

app.use(express.static("dist"));

const mongoose = require("mongoose");
const pass = process.env.password;
console.log(pass);

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = `mongodb+srv://quote-app:${pass}@plastic-db.djoer9l.mongodb.net/QuotesApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const quoteSchema = new mongoose.Schema({
  text: String,
  source: String,
  color: String,
});

var MyLib = {
  lastUid: 100000000,

  generateUid: function () {
    this.lastUid++;

    var randValue = Math.floor(Math.random() * (99999 - 10000)) + 10000;

    return String(this.lastUid.toString() + randValue);
  },
};

let complimentsData = {
  compliments: [
    {
      id: 1,
      text: "I have just three things to teach: simplicity, patience, compassion. These three are your greatest treasures.",
      source: "Lao Tzu",
      color: "#D64933",
    },
    {
      id: 2,
      text: "Do today what others won't and achieve tomorrow what others can't.",
      source: "Jerry Rice",
      color: "#0C7C59",
    },
    {
      id: 3,
      text: "In character, in manner, in style, in all things, the supreme excellence is simplicity.",
      source: "Henry Wadsworth Longfellow",
      color: "#58A4B0",
    },
    {
      id: 4,
      text: "If we don't discipline ourselves, the world will do it for us.",
      source: "William Feather",
      color: "#C94277",
    },
    {
      id: 5,
      text: "Rule your mind or it will rule you.",
      source: "Horace",
      color: "#3066BE",
    },
    {
      id: 6,
      text: "All that we are is the result of what we have thought.",
      source: "Buddha",
      color: "#63458A",
    },
    {
      id: 7,
      text: "Doing just a little bit during the time we have available puts you that much further ahead than if you took no action at all.",
      source: "Pulsifer, Take Action; Don't Procrastinate",
      color: "#84894A",
    },
    {
      id: 8,
      text: "Never leave that till tomorrow which you can do today.",
      source: "Benjamin Franklin",
      color: "#43AA8B",
    },
    {
      id: 9,
      text: "Procrastination is like a credit card: it's a lot of fun until you get the bill.",
      source: "Christopher Parker",
      color: "#7B6D8D",
    },
    {
      id: 10,
      text: "Someday is not a day of the week.",
      source: "Author Unknown",
      color: "#CA895F",
    },
    {
      id: 11,
      text: "Tomorrow is often the busiest day of the week.",
      source: "Spanish Proverb",
      color: "#F6AE2D",
    },
    {
      id: 12,
      text: "I can accept failure, everyone fails at something. But I can't accept not trying.",
      source: "Michael Jordan",
      color: "#D57A66",
    },
    {
      text: "Don't go back, walk forward",
      source: "James bond",
      color: "#1E1912",
      id: 14,
    },
  ],
};

let adminAuth = {
  admins: [{ email: "giodavlasheridze88@gmail.com", password: "giogio" }],
};

let receiveComplimentsData = {
  receiveTexts: [],
};

// **********************************  ************************************* //

// app.get("/api/admins", (request, response) => {
//   response.json(adminAuth.admins);
// });
app.get("/api/admins", (request, response) => {
  Quote.find({}).then((quote) => {
    response.json(adminAuth.admins);
  });
});

// **********************************  ************************************* //

// app.get("/api/compliments", (request, response) => {
//   response.json(complimentsData.compliments);
// });
app.get("/api/compliments", (request, response) => {
  Quote.find({}).then((quote) => {
    response.json(complimentsData.compliments);
  });
});

// **********************************  ************************************* //
// app.get("/api/receiveTexts", (request, response) => {
//   response.json(receiveComplimentsData.receiveTexts);
// });
app.get("/api/receiveTexts", (request, response) => {
  Quote.find({}).then((receivedTexts) => {
    response.json(receiveComplimentsData.receiveTexts);
  });
});

app.get("/api/compliments/:id", (request, response) => {
  const id = Number(request.params.id);
  const compliment = complimentsData.compliments.find(
    (compliment) => compliment.id === id
  );
  if (compliment) {
    response.json(compliment);
  } else {
    response.status(404).end();
  }
});

// POST request *********************************************

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

app.post("/api/compliments", (request, response) => {
  const body = request.body;

  if (!body.text) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const color = getRandomColor();

  const compliment = {
    text: body.text,
    source: body.source,
    color: color,
    id: MyLib.generateUid(),
  };

  complimentsData.compliments = complimentsData.compliments.concat(compliment);

  response.json(complimentsData);
});

// POST Request ** receivedTexts **  ************************

//********************************************************* */
app.post("/api/receiveTexts", (request, response) => {
  const body = request.body;

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
    id: MyLib.generateUid(),
  };

  receiveComplimentsData.receiveTexts =
    receiveComplimentsData.receiveTexts.concat(compliment);

  response.json(receiveComplimentsData);
});

// DELETE Request ********************************************8

app.delete("/api/compliments/:id", (request, response) => {
  const id = Number(request.params.id);

  complimentsData.compliments = complimentsData.compliments.filter(
    (note) => note.id !== id
  );
  response.status(204).end();
});

app.delete("/api/receiveTexts/:id", (request, response) => {
  console.log(typeof request.params.id, "delete request ...");
  const id = Number(request.params.id);

  receiveComplimentsData.receiveTexts =
    receiveComplimentsData.receiveTexts.filter(
      (note) => Number(note.id) !== id
    );
  response.status(204).end();
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
