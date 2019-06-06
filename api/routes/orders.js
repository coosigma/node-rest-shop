const express = require("express");
const router = express.Router();
const checkAuth = require("../midlleware/check-auth");

const OrdersController = require("../controllers/orders");

//  Handle incoming GET Requests to /orders
router.get("/", checkAuth, OrdersController.orders_get_all);

router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

router.post("/", checkAuth, OrdersController.orders_create_order);

router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;
