# Shopify Backend Challenge 2019
### By Advait Maybhate

# Summary
The following documentation outlines the use of a Web API created for Shopify's backend developer 2019 internship application. The API is built using **Node.js** and **MongoDB** (using **mLab** to host the database and **Heroku** to host the server) with the **GraphQL** language and can be accessed at `https://shop2019.herokuapp.com/graphql` with sample queries taking the form of `https://shop2019.herokuapp.com/graphql/?query=*INSERT GRAPHQL QUERY HERE*`. Examples of sample queries and mutations are provided in addition to a detailed description of the schema itself.

# Documentation

## Examples

### Remove item(s) from inventory

### Add item(s) to inventory
Adding a new product request:
```javascript
mutation {
  addProduct(id: 1, title: "hat", price: 10.50, inventory_count: 5) {
    id
    title
    price
    inventory_count
  }
}
```

Result:
```javascript
{
  "data": {
    "addProduct": {
      "id": 1,
      "title": "hat",
      "price": 10.5,
      "inventory_count": 5
    }
  }
}
```

If you try to add a product with a duplicate key:
```javascript
{
  "errors": [
    {
      "message": "E11000 duplicate key error index: shopdb.products.$id_1 dup key: { : 2 }",
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ],
      "path": [
        "addProduct"
      ]
    }
  ],
  "data": {
    "addProduct": null
  }
}
```

### Purchase item(s) (add to shopping cart)
Request:
```javascript
mutation {
  addToCart(email: "dan@dan.com", product_id: 1, amount: 2) {
    email,
    name,
    cart {
      cart_items {
        product_id
        amount
      }
      cart_total_cost
    }
  }
}
```

Example Result (returns object before mutation is applied):
```javascript
{
  "data": {
    "addToCart": {
      "email": "bob@gmail.com",
      "name": "Bob Smith",
      "cart": {
        "cart_items": [
          {
            "product_id": 1,
            "amount": 1
          }
        ],
        "cart_total_cost": 50.15
      }
    }
  }
}
```

### Check-out shopping cart
Request:
```javascript
mutation {
  checkoutCart(email: "james@gmail.com") {
    email,
    name,
    cart {
      cart_items {
        product_id
        amount
      }
      cart_total_cost
    }
  }
}
```

Result (before check-out):
```javascript
{
  "data": {
    "checkoutCart": {
      "email": "james@gmail.com",
      "name": "James White",
      "cart": {
        "cart_items": [
          {
            "product_id": 3,
            "amount": 3
          },
          {
            "product_id": 2,
            "amount": 5
          }
        ],
        "cart_total_cost": 900.72
      }
    }
  }
}
```

Note: If multiple users add items to their cart and then sequentially start checking out items, it is possible a user that checks out an item at a later time may not actually be able to buy the item since there is no longer sufficient stock. In this case, the later user’s cart is cleared and an appropriate error message is returned.

### Query all users
Request:
```javascript
query {
  users {
    email
    name
    cart {
      cart_items {
        product_id
        amount
      }
      cart_total_cost
    }
  }
}
```

Result:
```javascript
{
  "data": {
    "users": [
      {
        "email": "james@gmail.com",
        "name": "James White",
        "cart": {
          "cart_items": [],
          "cart_total_cost": 0
        }
      },
      {
        "email": "bob@gmail.com",
        "name": "Bob Smith",
        "cart": {
          "cart_items": [],
          "cart_total_cost": 0
        }
      }
    ]
  }
}
```

Note: Mutations return original objects before mutations are applied! You must query once again to obtain the mutated object's details, if the mutations were successful!

Note 2: If checking out a cart results in a product that has insufficient stock being requested then the user's entire cart is cleared and the request is rejected.

## Known Limitations
- Editing product's price while product is in a user's cart will not affect that user's cart total cost.
- Floating-point arithmetic issues when dealing with floats i.e. a cart total cost's may be imprecise.

# Schema Types

<details>
  <summary><strong>Table of Contents</strong></summary>

  * [Query](#query)
  * [Mutation](#mutation)
  * [Objects](#objects)
    * [Cart](#cart)
    * [CartItem](#cartitem)
    * [Product](#product)
    * [User](#user)
  * [Scalars](#scalars)
    * [Boolean](#boolean)
    * [Float](#float)
    * [Int](#int)
    * [String](#string)

</details>

## Query
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>user</strong></td>
<td valign="top"><a href="#user">User</a></td>
<td>Returns desired information of a single user</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">email</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Valid email associated with user</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>users</strong></td>
<td valign="top">[<a href="#user">User</a>]</td>
<td>Returns all users in database</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>product</strong></td>
<td valign="top"><a href="#product">Product</a></td>
<td>Returns a specific product's information</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Valid product ID</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>products</strong></td>
<td valign="top">[<a href="#product">Product</a>]</td>
<td>Returns all products in database</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>productsWithInventory</strong></td>
<td valign="top">[<a href="#product">Product</a>]</td>
<td>Returns all products in database with non-zero inventory i.e. positive inventory</td>
</tr>
</tbody>
</table>

## Mutation
<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>addUser</strong></td>
<td valign="top"><a href="#user">User</a></td>
<td>Add a new user</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">email</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Email of user (cannot duplicate existing emails)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Name of user</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>editUser</strong></td>
<td valign="top"><a href="#user">User</a></td>
<td>Allows for user's name to be edited (email cannot be edited)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">email</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Valid email (email cannot be changed)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">name</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>New name for user</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>deleteUser</strong></td>
<td valign="top"><a href="#user">User</a></td>
<td>Deletes a user from the database</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">email</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Valid email of user to delete</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>addToCart</strong></td>
<td valign="top"><a href="#user">User</a></td>
<td>Allows for addition of a valid product with specified amount to user's cart. If product is already in cart, the desired amount is simply added, otherwise the product is added to the cart (also updates cart's total cost).</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">email</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Valid email associated with desired user</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">product_id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Must be a valid product ID</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">amount</td>
<td valign="top"><a href="#int">Int</a></td>
<td>Defaults to 1, amount of products to add to cart</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>removeFromCart</strong></td>
<td valign="top"><a href="#user">User</a></td>
<td>Allows for removal of specific products with desired amounts from user's cart (reduces cart's total cost)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">email</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Valid email associated with desired user</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">product_id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Must be a valid product ID (that is present in the cart of specified user)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">amount</td>
<td valign="top"><a href="#int">Int</a></td>
<td>Defaults to 1, amount of product to remove from cart</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>checkoutCart</strong></td>
<td valign="top"><a href="#user">User</a></td>
<td>"Checks out" the cart of the specified user (reduces relevant inventory count)- note: does not allow check-out if there is not sufficient inventory available, in which case the cart is cleared</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">email</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Email of the user whose cart should be checked out</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>clearCart</strong></td>
<td valign="top"><a href="#user">User</a></td>
<td>Completely clears the cart of specified user</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">email</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Email of the user whose cart should be cleared</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>addProduct</strong></td>
<td valign="top"><a href="#product">Product</a></td>
<td>Create and add a new product to the database</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>ID of product (cannot be a duplicate of any existing IDs)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">title</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Title of product</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">price</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td>Price of product</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">inventory_count</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Initial inventory count</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>editProduct</strong></td>
<td valign="top"><a href="#product">Product</a></td>
<td>Overwrites product information with desired values (cannot change product IDs)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Must be valid product ID (you cannot edit the product ID)</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">title</td>
<td valign="top"><a href="#string">String</a>!</td>
<td>New title</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">price</td>
<td valign="top"><a href="#float">Float</a>!</td>
<td>New price</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">inventory_count</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>New inventory count</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>reduceProduct</strong></td>
<td valign="top"><a href="#product">Product</a></td>
<td>Decreases amount of inventory of a specific product</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Must be a valid product ID</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">amount</td>
<td valign="top"><a href="#int">Int</a></td>
<td>Defaults to 1, or can be specified</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>increaseProduct</strong></td>
<td valign="top"><a href="#product">Product</a></td>
<td>Increases amount of inventory of a specific product</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Must be a valid product ID</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">amount</td>
<td valign="top"><a href="#int">Int</a></td>
<td>Defaults to 1, or can be specified</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>deleteProduct</strong></td>
<td valign="top"><a href="#product">Product</a></td>
<td>Completely deletes a product</td>
</tr>
<tr>
<td colspan="2" align="right" valign="top">id</td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Must be a valid product ID</td>
</tr>
</tbody>
</table>

## Objects

### Cart

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>cart_items</strong></td>
<td valign="top">[<a href="#cartitem">CartItem</a>]!</td>
<td>Array storing details of each item in the cart (product IDs and amounts)</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cart_total_cost</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td>Stores total cost of cart (non-negative)</td>
</tr>
</tbody>
</table>

### CartItem

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>product_id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Product ID (must be linked to valid product)</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>amount</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Amount of product</td>
</tr>
</tbody>
</table>

### Product

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>id</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Product ID (must be unique)</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>title</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Title of the product</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>price</strong></td>
<td valign="top"><a href="#float">Float</a>!</td>
<td>Price of the product</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>inventory_count</strong></td>
<td valign="top"><a href="#int">Int</a>!</td>
<td>Available inventory count (non-negative)</td>
</tr>
</tbody>
</table>

### User

<table>
<thead>
<tr>
<th align="left">Field</th>
<th align="right">Argument</th>
<th align="left">Type</th>
<th align="left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td colspan="2" valign="top"><strong>email</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Email of the user (must be unique)</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>name</strong></td>
<td valign="top"><a href="#string">String</a>!</td>
<td>Name of the user</td>
</tr>
<tr>
<td colspan="2" valign="top"><strong>cart</strong></td>
<td valign="top"><a href="#cart">Cart</a>!</td>
<td>Stores cart items and the cart's total cost</td>
</tr>
</tbody>
</table>

## Scalars

### Boolean

The `Boolean` scalar type represents `true` or `false`.

### Float

The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](http://en.wikipedia.org/wiki/IEEE_floating_point). 

### Int

The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. 

### String

The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.

