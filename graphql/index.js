// makeExecutableSchema = require("graphql-tools")
// typeDefs = require("./types/")
// resolvers = require("./resolvers/")
import { makeExecutableSchema } from "graphql-tools";

import typeDefs from "./types/";
import resolvers from "./resolvers/";

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
});

export default schema;
