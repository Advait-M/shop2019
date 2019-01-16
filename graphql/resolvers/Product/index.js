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
      return new Promise((resolve, reject) => {
        Product.findOne({ id: id }).exec(
          (err, res) => {
            if (err) {
              reject(err);
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
    reduceProductByOne: (root, { id }) => {
      return new Promise((resolve, reject) => {
        Product.findOne({ id: id }).exec(
          (err, res) => {
            if (err) {
              reject(err)
            }
            Product.findOneAndUpdate({ id: id }, { $set: { inventory_count: res.inventory_count - 1 } }).exec(
              (err, res) => {
                err ? reject(err) : resolve(res);
              }
            );
          }
        );
      });
    },
    increaseProduct: (root, { id, amount }) => {
      return new Promise((resolve, reject) => {
        Product.findOne({ id: id }).exec(
          (err, res) => {
            if (err) {
              reject(err)
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
    increaseProductByOne: (root, { id }) => {
      return new Promise((resolve, reject) => {
        Product.findOne({ id: id }).exec(
          (err, res) => {
            if (err) {
              reject(err)
            }
            Product.findOneAndUpdate({ id: id }, { $set: { inventory_count: res.inventory_count + 1 } }).exec(
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
