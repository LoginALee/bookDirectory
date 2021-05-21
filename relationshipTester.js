const models = require("./models");
const User = models.User;
const Book = models.Book;

User.create({
  firstName: "Alex",
  lastName: "Tinoco",
  password: "123",
  email: "alex@gmail.com",
  username: "ale12",
})
  .then((newUser) => {
    console.log("User created", newUser.get());
  })
  .catch((err) => {
    console.log("Error during creating user", err);
  });

Book.bulkCreate([
  {
    title: "Principito",
    author: "Pepe",
    publication_date: new Date().toISOString(),
    abstract: "Resumen...",
    cover:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FEnglish_textbook.jpg%2F1200px-English_textbook.jpg&f=1&nofb=1",
    userId: 2,
  },
  {
    title: "Otro libro",
    author: "Pepe",
    publication_date: new Date().toISOString(),
    abstract: "Resumen...",
    cover:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FEnglish_textbook.jpg%2F1200px-English_textbook.jpg&f=1&nofb=1",
    userId: 2,
  },
  {
    title: "Otro libro 2",
    author: "Pepe",
    publication_date: new Date().toISOString(),
    abstract: "Resumen...",
    cover:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FEnglish_textbook.jpg%2F1200px-English_textbook.jpg&f=1&nofb=1",
    userId: 2,
  },
])
  .then((newBooks) => {
    console.log("Created books", newBooks);
  })
  .catch((err) => {
    console.log("Error creating books", err);
  });

Book.findOne({
  where: { title: "Otro libro 2" },
  include: "user",
})
  .then((findedBook) => {
    console.log("Finded book: ", findedBook);
    console.log("Finded book user:", findedBook.user);
  })
  .catch((err) => {
    console.log("Error finding book", err);
  });

User.findByPk(1, { include: ["books"] })
  .then((user) => {
    console.log("Finded user: ", user);
    console.log("Finded user books", user.get().books);
  })
  .catch((err) => {
    console.log("Error finding user", err);
  });
