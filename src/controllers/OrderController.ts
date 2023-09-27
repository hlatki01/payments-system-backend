import { Request, Response } from "express";
import { OrderService } from "../../src/services/OrderService";
import prismaClient from "../prisma";
import { GatewayService } from "../services/GatewayService";

const orderService = new OrderService();
const gatewayService = new GatewayService();


class OrderController {
    async create(req: Request, res: Response) {
        try {
            const { orderNumber, productIds, payerName } = req.body;
            const { companyId, userId } = req
            const newOrder = await orderService.create({ orderNumber, userId, companyId, productIds, payerName });
            res.json(newOrder);
        } catch (error) {
            console.error("Error in create:", error);
            res.status(500).json({ error: "An error occurred while creating an order." });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { orderId, orderNumber, userId, companyId } = req.body;
            const updatedOrder = await orderService.update({ orderId, orderNumber, userId, companyId });
            res.json(updatedOrder);
        } catch (error) {
            console.error("Error in update:", error);
            res.status(500).json({ error: "An error occurred while updating the order." });
        }
    }

    async one(req: Request, res: Response) {
        try {
            const orderId = req.query.orderId as string;
            const order = await orderService.one({ orderId });
            res.json(order);
        } catch (error) {
            console.error("Error in one:", error);
            res.status(500).json({ error: "An error occurred while fetching the order." });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const { orderId } = req.body;
            const deletedOrder = await orderService.delete({ orderId });
            res.json(deletedOrder);
        } catch (error) {
            console.error("Error in delete:", error);
            res.status(500).json({ error: "An error occurred while deleting the order." });
        }
    }
    async pay(req, res) {
        try {
            const { orderId, card, ticket, payerDocument } = req.body;
            const { companyId, userId } = req;

            const orderDetails = await prismaClient.order.findUnique({
                where: { id: orderId },
                include: { products: true }, // Include products to calculate the total amount
            });

            if (orderDetails) {
                // Calculate the total amount of the order's products
                const totalAmount = orderDetails.products.reduce((total, product) => {
                    return total + product.price;
                }, 0);

                let payload = {
                    amount: totalAmount,
                    currency: orderDetails.currency,
                    country: orderDetails.country,
                    payment_method_flow: 'DIRECT',
                    payer: {
                        name: orderDetails.payerName,
                        document: payerDocument,
                    },
                    order_id: orderDetails.orderNumber,
                    description: orderDetails.orderNumber,
                    notification_url: process.env.DLOCAL_NOTIFICATION_URL,
                    payment_method_id: null,
                    card: {},
                };

                if (ticket) {
                    payload.payment_method_id = ticket;
                }
                else {
                    payload.payment_method_id = 'CARD'
                }

                if (card) {
                    if (card.token) {
                        payload.card = { token: card.token }
                    } else {
                        payload.card = {
                            holder_name: card.holder_name,
                            number: card.number,
                            cvv: card.cvv,
                            expiration_month: card.expiration_month,
                            expiration_year: card.expiration_year,
                        };
                    }
                } else {
                    delete payload.card;
                }

                const createPayment = await gatewayService.createPayment(payload);

                if (createPayment) {
                    const updatedOrder = await orderService.update({
                        orderId,
                        country: orderDetails.country,
                        currency: orderDetails.currency,
                        payerDocument: payerDocument,
                        payerName: orderDetails.payerName,
                        payerEmail: orderDetails.payerEmail,
                        status: createPayment.status,
                        paymentMethodId: createPayment.payment_method_id,
                        paymentType: createPayment.payment_method_type,
                        orderNumber: orderDetails.orderNumber,
                        userId: userId,
                        companyId: companyId,
                        paymentData: ticket ? {
                            number: createPayment.ticket.number,
                            expirationDate: createPayment.ticket.expiration_date,
                            id: createPayment.ticket.id,
                            barcode: createPayment.ticket.barcode,
                            company_name: createPayment.ticket.company_name,
                            company_id: createPayment.ticket.company_id,
                            imageUrl: createPayment.ticket.image_url
                        } : createPayment.card,
                        invoice: createPayment.id
                    });

                    return res.status(201).json({ sucess: updatedOrder });
                }
            } else {
                res.status(404).json({ error: 'Order not found' });
            }
        } catch (error) {
            console.error('Error in pay:', error);
            res.status(500).json({ error: 'An error occurred while processing the payment.' });
        }
    }

}

export { OrderController };
