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
  }
  type Mutation {
    addProduct(id: Int!, title: String!, price: Float!, inventory_count: Int!): Product
    editProduct(id: Int!, title: String, price: Float, inventory_count: Int): Product
    reduceProduct(id: Int!, title: String, amount: Int): Product
    reduceProductByOne(id: Int!, title: String): Product
    increaseProduct(id: Int!, title: String, amount: Int): Product
    increaseProductByOne(id: Int!, title: String): Product
    deleteProduct(id: Int!, title: String, price: Float, inventory_count: Int): Product
  }
`;
