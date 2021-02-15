// logic for our end points

const express = require("express");
const { stringify } = require("querystring");
const cartItems = express.Router();

// array of items

const cartList = [
    
    {id: 1, product: 'salsa', price: 5.99, quantity: 2},
    {id: 2, product: 'chips', price: 3.29, quantity: 4},
    {id: 3, product: 'popcorn', price: 2.89, quantity: 1},
    {id: 4, product: 'soda', price: 1.99, quantity: 6},

  ];

cartItems.get("/", (req, res) => {
    
  // display cart itmes that are less than the max price

  const maxPrice = parseFloat(req.query.maxPrice);
  const prefix = req.query.prefix;
  const pageSize = parseInt(req.query.pageSize);

    if (maxPrice) {
      const filtereditem = cartList.filter((i) => i.price <= maxPrice)
      res.json(filtereditem);    
    }

    // display cart items that start with string

    if (prefix) {
      const filtereditem = cartList.filter((i) => i.product.startsWith(prefix))
      res.json(filtereditem);
    }
    
    // display specific number of cart items

    if (pageSize) {
      const filtereditem = cartList.splice(0,(pageSize))
      res.json(filtereditem);
    }

    else {

    // return the whole list  
    res.status(200);
    res.json(cartList);
    
    // res.json("ok");  not required 200 automatically shows "ok"
    }
  
});

cartItems.get("/:id", (req, res) => {

const id = parseInt(req.params.id);

  if (id) {
    console.log(id);
    const item = cartList.find(i => i.id === id)
    res.json(item);
  }

  else {
    res.status(404);
    res.send("Sorry no such ID");
  }
});  

// Add an item to the array using the JSON body of the request 

cartItems.post("/", (req, res) => {
  
    let newitem = {
        id: cartList.length + 1,
        product: req.body.product,
        price: parseFloat(req.body.price),
        quantity: parseInt(req.body.quantity),
    };
    cartList.push(newitem);
    res.status(201);
    res.json(cartList); // return changed list
 });
 
// Update cart item in the array that has a given ID.  

 cartItems.put("/:id", (req, res) => {
  
    // look up item
    const item = cartList.find(i => i.id === parseInt(req.params.id));
   
    // if item does not exist return 404
    if (!item) return res.status(404).send('Item not found'); // Item not found = 404 error
  
    // update item
    item.product = req.body.product, item.price = req.body.price, item.quantity = req.body.quantity;
  
    //return updated item
    res.status(200);
    res.send(item);
  });
  
// Delete item by a given ID

cartItems.delete("/:id", (req, res) => {
  
  const index = parseInt(req.params.id);
  cartList.splice(index, 1);
  res.status(201);
  res.json(cartList);

});  

module.exports = cartItems;