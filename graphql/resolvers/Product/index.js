// The Product schema
import Product from "../../../models/Product";

export default {
  Query: {
    product: (root, args) => {
      return new Promise((resolve, reject) => {
        Product.findOne(args).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    products: () => {
      return new Promise((resolve, reject) => {
        Product.find({})
          .populate()
          .exec((err, res) => {
            err ? reject(err) : resolve(res);
          });
      });
    },
    productsWithInventory: () => {
      return new Promise((resolve, reject) => {
        Product.find({})
          .populate()
          .exec((err, res) => {
            err ? reject(err) : resolve(res.filter((value, index, arr) => {
              return value.inventory_count > 0;
            }));
          });
      });
    }
  },
  Mutation: {
    addProduct: (root, { id, title, price, inventory_count }) => {
      const newProduct = new Product({ id, title, price, inventory_count });

      return new Promise((resolve, reject) => {
        newProduct.save((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    },
    editProduct: (root, { id, title, price, inventory_count }) => {
      return new Promise((resolve, reject) => {
        Product.findOneAndUpdate({ id }, { $set: { title, price, inventory_count } }).exec(
          (err, res) => {
            err ? reject(err) : resolve(res);
          }
        );
      });
    },    
    reduceProduct: (root, { id, amount }) => {
      if (amount === undefined) {
        amount = 1;
      }
      return new Promise((resolve, reject) => {
        if (amount <= 0) {
          reject("Amount must be positive.");
          return;
        }

        Product.findOne({ id: id }).exec(
          (err, res) => {
            if (err) {
              reject(err);
              return;
            }
            if (amount > res.inventory_count) {
              reject("Cannot remove " + amount + " products since there are only " + res.inventory_count + " products in stock.");
              return;
            }
            Product.findOneAndUpdate({ id: id }, { $set: { inventory_count: res.inventory_count - amount } }).exec(
              (err, res) => {
                err ? reject(err) : resolve(res);
              }
            );
          }
        );
      });
    },
    increaseProduct: (root, { id, amount }) => {
      if (amount === undefined) {
        amount = 1;
      }
      return new Promise((resolve, reject) => {
        if (amount <= 0) {
          reject("Amount must be positive.");
          return;
        }

        Product.findOne({ id: id }).exec(
          (err, res) => {
            if (err) {
              reject(err);
              return;
            }
            Product.findOneAndUpdate({ id: id }, { $set: { inventory_count: res.inventory_count + amount } }).exec(
              (err, res) => {
                err ? reject(err) : resolve(res);
              }
            );
          }
        );
      });
    },
    deleteProduct: (root, { id }) => {
      return new Promise((resolve, reject) => {
        Product.findOneAndRemove({ id: id }).exec((err, res) => {
          err ? reject(err) : resolve(res);
        });
      });
    }
  }
};
