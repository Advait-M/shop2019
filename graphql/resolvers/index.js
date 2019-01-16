import { mergeResolvers } from "merge-graphql-schemas";

import User from "./User/";
import Product from "./Product/"

const resolvers = [User, Product];

export default mergeResolvers(resolvers);