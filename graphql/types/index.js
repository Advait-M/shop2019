import { mergeTypes } from "merge-graphql-schemas";

import User from "./User/";
import Product from "./Product/";
import Cart from "./Cart/";
import CartItem from "./CartItem/";

const typeDefs = [User, Product, Cart, CartItem];

export default mergeTypes(typeDefs, { all: true });
