import { Router } from "express";
import multer from "multer";

import { isAuthenticated } from "./middlewares/isAuthenticated";

import uploadConfig from "./config/multer";
import { UserController } from "./controllers/UserController";
import { CompanyController } from "./controllers/CompanyController";
import { PaymentController } from "./controllers/PaymentController";
import { CategoryController } from "./controllers/CategoryController";
import { ProductController } from "./controllers/ProductController";
import { OrderController } from "./controllers/OrderController";

const router = Router();

// Multer configuration for company uploads
const uploads = multer(uploadConfig.upload("./storage"));

//-- USER ROUTES --
const userController = new UserController();
router.post("/users/auth", userController.auth);
router.post("/users/create", uploads.single("file"), userController.create);
router.post("/users/update", uploads.single("file"), isAuthenticated, userController.update);
router.post("/users/delete", isAuthenticated, userController.delete);
router.get("/users/one", isAuthenticated, userController.one);
router.get("/users/me", isAuthenticated, userController.me);

//-- COMPANY ROUTES --
const companyController = new CompanyController();
router.post("/companies/create", uploads.single("file"), companyController.create);
router.post("/companies/update", isAuthenticated, uploads.single("file"), companyController.update);
router.post("/companies/delete", isAuthenticated, companyController.delete);
router.get("/companies/one", isAuthenticated, companyController.one);

//-- PAYMENTS ROUTES --
const paymentController = new PaymentController();
router.post("/payments/create", isAuthenticated, paymentController.create);
router.post("/payments/notification", paymentController.notification);
router.put("/payments/update", isAuthenticated, paymentController.update);
router.get("/payments/all", isAuthenticated, paymentController.getAllPayments);
router.get("/payments/user/:userId", isAuthenticated, paymentController.getPaymentsByUser);
router.get("/payments/company/:companyId", isAuthenticated, paymentController.getPaymentsByCompany);

//-- CATEGORY ROUTES --
const categoryController = new CategoryController();
router.post("/categories/create", isAuthenticated, categoryController.create);
router.post("/categories/update", isAuthenticated, categoryController.update);
router.post("/categories/delete", isAuthenticated, categoryController.delete);
router.get("/categories/one", isAuthenticated, categoryController.one);

//-- PRODUCT ROUTES --
const productController = new ProductController();
router.post("/products/create", isAuthenticated, productController.create);
router.post("/products/update", isAuthenticated, productController.update);
router.post("/products/delete", isAuthenticated, productController.delete);
router.get("/products/one", isAuthenticated, productController.one);

//-- ORDER ROUTES --
const orderController = new OrderController();
router.post("/orders/create", isAuthenticated, orderController.create);
router.post("/orders/update", isAuthenticated, orderController.update);
router.post("/orders/delete", isAuthenticated, orderController.delete);
router.get("/orders/one", isAuthenticated, orderController.one);
router.post("/orders/pay", isAuthenticated, orderController.pay);

export { router };
