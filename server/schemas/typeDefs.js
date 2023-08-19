const typeDefs = `
  type User {
    _id: ID
    username: String!
    email: String!
    password: String!
    savedBooks: [Book]!
  }

  type Book {
    _id: ID
    authors: [String]
    description: String
    bookId: String
    image: String
    link: String
    title: String
  }

  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String, _id: ID): User
    me: User
  }

  input BookInput {
    authors: [String]!
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
}

  type Mutation {
    addUser(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
    addBook(input: BookInput!): User
    removeBook (bookId: String): User
  }
`;

module.exports = typeDefs;
