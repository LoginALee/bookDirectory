import { models } from "./models";
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
    console.log(newUser.get());
  })
  .catch((err) => {
    console.log(err);
  });

Book.bulkCreate([
  {
    title: "Principito",
    author: "Pepe",
    publication_date: new Date().toISOString(),
    abstract: "Resumen...",
    cover:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FEnglish_textbook.jpg%2F1200px-English_textbook.jpg&f=1&nofb=1",
    userId: 1,
  },
  {
    title: "Otro libro",
    author: "Pepe",
    publication_date: new Date().toISOString(),
    abstract: "Resumen...",
    cover:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FEnglish_textbook.jpg%2F1200px-English_textbook.jpg&f=1&nofb=1",
    userId: 1,
  },
  {
    title: "Otro libro 2",
    author: "Pepe",
    publication_date: new Date().toISOString(),
    abstract: "Resumen...",
    cover:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fupload.wikimedia.org%2Fwikipedia%2Fcommons%2Fthumb%2F5%2F52%2FEnglish_textbook.jpg%2F1200px-English_textbook.jpg&f=1&nofb=1",
    userId: 1,
  },
])
  .then((newBooks) => {
    console.log(newBooks);
  })
  .catch((err) => {
    console.log(err);
  });

Book.finOne({
  where: { title: "Otro libro 2" },
  include: "user",
})
  .then((findedBook) => {
    console.log(findedBook);
    console.log(findedBook.user);
  })
  .catch((err) => {
    console.log(err);
  });

User.findByPk(1, { include: ["books"] })
  .then((user) => {
    console.log(user);
    console.log(user.get().books);
  })
  .catch((err) => {
    console.log(err);
  });
