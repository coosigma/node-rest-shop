const mongoose = require("mongoose");

const Product = require("../models/product");

exports.products_get_all = (req, res, next) => {
	Product.find()
		.select("-__v")
		.exec()
		.then(docs => {
			const response = {
				count: docs.length,
				products: docs.map(doc => {
					return { ...doc._doc };
				})
			};
			res.status(200).json(response);
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.products_create_product = (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
	});
	product
		.save()
		.then(result => {
			console.log(result);
			res.status(201).json({
				message: "Created product successfully",
				createdProduct: {
					name: result.name,
					price: result.price,
					_id: result._id,
					request: {
						type: req.method,
						url:
							req.protocol +
							"://" +
							req.get("host") +
							req.originalUrl +
							result._id
					}
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.products_get_product = (req, res, next) => {
	const id = req.params.productId;
	Product.findById(id)
		.select("-__v")
		.exec()
		.then(doc => {
			console.log("From database", doc);
			if (doc) {
				res.status(200).json({
					product: doc,
					request: {
						type: req.method,
						url: req.protocol + "://" + req.get("host") + req.originalUrl
					}
				});
			} else {
				res
					.status(404)
					.json({ message: "No Valid entry found for provided ID" });
			}
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};

exports.products_update_product = (req, res, next) => {
	Product.update({ _id: req.params.productId }, { $set: req.body })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Product updated",
				type: "GET",
				url: req.protocol + "://" + req.get("host") + req.originalUrl
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.products_delete_product = (req, res, next) => {
	const id = req.params.productId;
	Product.remove({ _id: id })
		.exec()
		.then(result => {
			res.status(200).json({
				message: "Product deleted",
				request: {
					type: "POST",
					url: req.protocol + "://" + req.get("host") + req.originalUrl,
					body: {
						name: "String",
						price: "Number"
					}
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({ error: err });
		});
};
