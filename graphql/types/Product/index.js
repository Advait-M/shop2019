export default `
  type Product {
    id: Int!
    title: String!
    price: Float!
    inventory_count: Int! 
  }
  type Query {
    product(id: Int!): Product
    products: [Product]
    productsWithInventory: [Product]
  }
  type Mutation {
    addProduct(id: Int!, title: String!, price: Float!, inventory_count: Int!): Product
    editProduct(id: Int!, title: String!, price: Float!, inventory_count: Int!): Product
    reduceProduct(id: Int!, amount: Int): Product
    increaseProduct(id: Int!, amount: Int): Product
    deleteProduct(id: Int!): Product
  }
`;
