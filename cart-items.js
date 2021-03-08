// logic for our end points

const express = require("express");
const { stringify } = require("querystring");
const cartItems = express.Router();
const pool = require('./connection');

cartItems.get("/", (req, res) => {

const maxPrice = parseFloat(req.query.maxPrice);
const prefix = (req.query.prefix);
const pageSize = parseInt(req.query.pageSize);

// Display max price

if (maxPrice) {

pool.query('SELECT * FROM shopping_cart WHERE price <= $1', [maxPrice]).then ( (results) => {
    const items = results.rows;
    res.json(items);
    res.status(200);
}
)}

// Display prefix

if (prefix) {

pool.query('SELECT * FROM shopping_cart WHERE product LIKE $1', [prefix]).then ((results) => {
    const items = results.rows;
    res.json(items);
    res.status(200);

})
}

// Display page size

if (pageSize) {

pool.query('SELECT * FROM shopping_cart LIMIT $1', [pageSize]).then ((results) => {
    const items = results.rows;
    res.json(items);
    res.status(200);

})
}

// Display all

else 
pool.query('SELECT * FROM shopping_cart').then((results) => {
  const items = results.rows;
  res.json(items);
  res.status(200);
})

});

// Get item by id

cartItems.get("/:id", (req, res) => {

const id = parseInt(req.params.id);

if (id) {
     
pool.query('SELECT * FROM shopping_cart WHERE id = $1', [id]).then ((results) => {
    const items = results.rows;
    res.json(items);
    res.status(200);

})
}

else {
    res.status(404);
    res.send("Sorry no such ID");
}

});

// Add an item to the array using the JSON body of the request 

cartItems.post("/", (req, res) => {

  const product = req.body.product;
  const price = parseFloat(req.body.price);
  const quantity = req.body.quantity;

  // console.log(product);

  pool.query('INSERT INTO shopping_cart (product, price, quantity) VALUES ($1, $2, $3) returning *',
  [product, price, quantity]).then ((results) => {  
  
    const items = results.rows;
    res.json(items);
    res.status(200);

  })

});

// update item

cartItems.put("/:id", (req, res) => {

  const id = parseInt(req.params.id);
  const product = req.body.product;
  const price = parseFloat(req.body.price);
  const quantity = req.body.quantity;

  pool.query(`UPDATE shopping_cart
  SET product=$1, price=$2, quantity=$3
  WHERE id=$4
  RETURNING *`, [product, price, quantity, id]).then((results) => {
    res.json(results.rows);
  });
});

// delete item

cartItems.delete("/:id", (req,res) => {
  
  let id = parseInt(req.params.id);

  pool.query(`DELETE FROM shopping_cart
    WHERE id=$1`, [id]).then((results) => {
    res.json();
  });

});

  // console.log(product);

module.exports = cartItems;