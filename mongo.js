const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://quote-app:${password}@plastic-db.djoer9l.mongodb.net/QuotesApp?retryWrites=true&w=majority`;

console.log(url);

mongoose.set("strictQuery", false);
mongoose.connect(url);

const quoteSchema = new mongoose.Schema({
  text: String,
  source: String,
  color: String,
});

const Quote = mongoose.model("Quote", quoteSchema);

const quote = new Quote({
  text: "გოუმარჯოს სიმართლეს",
  source: "ნიცშე",
  color: "#58A4B0",
});

Quote.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

quote.save().then((result) => {
  console.log("quote saved!");
  mongoose.connection.close();
});
