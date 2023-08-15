const { User, Book } = require("../models");
const { signToken, AuthenticationError } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate("savedBooks");
    },
    user: async (parent, { username, _id }) => {
      return User.findOne({
        ...(_id ? { _id } : {}),
        ...(username ? { username } : {}),
      }).populate("savedBooks");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw AuthenticationError;
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return { token, user };
    },

    addBook: async (parent, { input }, context) => {
      if (context.user) {
        const { authors, description, bookId, image, link, title } = input;

        const book = await Book.create({
          authors,
          description,
          bookId,
          image,
          link,
          title,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { books: book._id } }
        );
        return book;
      }
      throw AuthenticationError("You need to be logged in!");
    },

    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const book = await Book.findOneAndDelete({
          bookId: bookId,
        });
        await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: book.bookId } },
          { new: true }
        );
        return book;
      }
      throw AuthenticationError("You need to be logged in!");

    },
  },
};

module.exports = resolvers;
