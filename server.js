// require the Express module

const express = require("express");

// creates an instance for the Express server

const app = express();
app.use(express.json());

const cartItems = require("./cart-items");

app.use("/cart-items", cartItems);

const port = 3000;

app.listen(port, () => console.log(`Listening on port: ${port}.`));

