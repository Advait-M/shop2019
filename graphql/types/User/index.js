export default `
  type User {
    email: String!
    name: String!
    cart: Cart!    
  }
  type Query {
    user(email: String!): User
    users: [User]
  }
  type Mutation {
    addUser(email: String!, name: String!): User
    editUser(email: String!, name: String!): User
    deleteUser(email: String!): User
    addToCart(email: String!, product_id: Int!, amount: Int) : User
    checkoutCart(email: String!) : User
    clearCart(email: String!) : User
  }
`;
