// The User schema
import User from "../../../models/User";
import Cart from "../../../models/Cart";
import Product from "../../../models/Product"; 

export default {
  Query: {
    user: (root, args) => {
      return new Promise((resolve, reject) => {
        User.findOne(args).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    users: () => {
      return new Promise((resolve, reject) => {
        User.find({})
          .populate()
          .exec((err, res) => {
            err ? reject(err) : resolve(res);
          });
      });
    }
  },
  Mutation: {
    addUser: (root, { email, name }) => {
      // const newCart = new Cart({ cart_items: [], cart_total: 0 });
      const newUser = new User({ email, name, cart: { cart_items: [], cart_total_cost: 0 } });

      return new Promise((resolve, reject) => {
        newUser.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    editUser: (root, { email, name }) => {
      return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ email }, { $set: { name } }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },
    deleteUser: (root, { email }) => {
      return new Promise((resolve, reject) => {
        User.findOneAndRemove({ email: email }).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    addToCart: (root, { email, product_id, amount }) => {
      if (amount === undefined) {
        amount = 1;
      }
      return new Promise((resolve, reject) => {
        if (amount <= 0) {
          reject("Must add positive amount of products to cart.");
        }
        Product.findOne({ id: product_id }).exec(
          (err, resProduct) => {
            if (err) {
              reject(err);
            }
            User.findOne({ email: email }).exec(
              (err, resUser) => {
                if (err) {
                  reject(err);
                  return;
                }

                if (amount > resProduct.inventory_count) {
                  reject("Not enough inventory at the moment, sorry!")
                  return;
                }

                let cur_cart = resUser.cart
                let found = false
                for (let i = 0; i < cur_cart.cart_items.length; i++) {
                  let cart_item = cur_cart.cart_items[i]
                  if (cart_item.product_id === product_id){
                    cart_item.amount += amount
                    if (cart_item.amount > resProduct.inventory_count) {
                      // cart_item.amount -= amount
                      reject("Not enough inventory at the moment, sorry!");
                      return;
                    }
                    found = true
                  }
                }

                if (!found) {
                  cur_cart.cart_items.push({product_id: product_id, amount: amount});
                }

                cur_cart.cart_total_cost += amount * resProduct.price;

                User.findOneAndUpdate({ email: email }, { $set: { cart: cur_cart } }).exec(
                  (err, res) => {
                    err ? reject(err) : resolve(res);
                  }
                );
              } 
            );
          });
        }
      );
    },
    checkoutCart: (root, { email }) => {
      return new Promise((resolve, reject) => {
        User.findOne({ email: email }).exec(
          (err, resUser) => {
            if (err) {
              reject(err);
              return;
            }

            if (resUser.cart.cart_items.length === 0) {
              reject("Cart is empty.");
              return;
            }
   
            let promises = [];
            resUser.cart.cart_items.map((cart_item, i) => {
              promises.push(Product.findOne({ id: resUser.cart.cart_items[i].product_id }).exec());
            });

            Promise.all(promises).then((values) => {
              for (let i = 0; i < values.length; i++) {
                if (resUser.cart.cart_items[i].amount > values[i].inventory_count) {
                    // Cart is cleared
                    User.findOneAndUpdate({ email: email }, { $set: { cart: { cart_items: [], cart_total_cost: 0 } } }).exec(
                      (err, res) => {
                        if (err) {
                          reject(err);
                          return;
                        }
                      }
                    );
                    reject("Clearing cart due to insufficient stock of: " + values[i].title + " with product id: " + values[i].id);
                    return;
                  }
              }

              for (let i = 0; i < resUser.cart.cart_items.length; i++) {
                Product.findOne({ id: resUser.cart.cart_items[i].product_id }).exec(
                  (err, resProduct) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    // await new Promise((resolve, reject) => {
                    Product.findOneAndUpdate({ id: resUser.cart.cart_items[i].product_id }, { $set: { inventory_count: resProduct.inventory_count - resUser.cart.cart_items[i].amount } }).exec(
                      (err, res) => {
                        if (err) {
                          reject(err);
                          return;
                        }
                      }
                    );
                  }
                );
              }

              // Cart is cleared
              User.findOneAndUpdate({ email: email }, { $set: { cart: { cart_items: [], cart_total_cost: 0 } } }).exec(
                (err, res) => {
                  err ? reject(err) : resolve(res);
                }
              );
            });            
          }
        );
      });
    },
    clearCart: (root, { email }) => {
      return new Promise((resolve, reject) => {
        User.findOneAndUpdate({ email: email }, { $set: { cart: { cart_items: [], cart_total_cost: 0 } } }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    }
  }
};


