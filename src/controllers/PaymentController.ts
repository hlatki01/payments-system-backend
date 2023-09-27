import { Request, Response } from "express";
import PaymentService from "../services/PaymentService";
import { GatewayService } from "../services/GatewayService";
import prismaClient from "../prisma";
import { OrderService } from "../services/OrderService";

const paymentService = new PaymentService();
const orderService = new OrderService();
const gatewayService = new GatewayService();

class PaymentController {
    async create(req: Request, res: Response) {
        try {
            const {
                amount,
                description,
                cardDetails,
                payerDetails,
                countryDetails,
                paymentDetails,
                notificationUrl,
                invoice
            } = req.body;

            const {
                userId,
                companyId,
            } = req

            const missingParams = [];

            if (!amount) missingParams.push('amount');
            if (!description) missingParams.push('description');
            if (!payerDetails) missingParams.push('payerDetails');
            if (!countryDetails) missingParams.push('countryDetails');
            if (!paymentDetails) missingParams.push('paymentDetails');
            if (!notificationUrl) missingParams.push('notificationUrl');
            if (!invoice) missingParams.push('invoice');

            if (missingParams.length > 0) {
                const errorMessages = missingParams.map(param => `${param} is missing or invalid`);
                return res.status(400).json({ error: errorMessages.join(', ') });
            }

            let payload = {
                amount: amount,
                currency: countryDetails.currency,
                country: countryDetails.country,
                payment_method_flow: paymentDetails.payment_method_flow,
                payer: {
                    name: payerDetails.name,
                    email: payerDetails.email,
                    document: payerDetails.document,
                },
                order_id: invoice,
                description: description,
                notification_url: notificationUrl,
                payment_method_id: null,
                card: {},
            };

            if (paymentDetails.payment_method_id) {
                payload.payment_method_id = paymentDetails.payment_method_id;
            }
            else {
                delete payload.payment_method_id
            }

            if (cardDetails) {
                if (cardDetails.token) {
                    payload.card = { token: cardDetails.token }
                } else {
                    payload.card = {
                        holder_name: cardDetails.holder_name,
                        number: cardDetails.number,
                        cvv: cardDetails.cvv,
                        expiration_month: cardDetails.expiration_month,
                        expiration_year: cardDetails.expiration_year,
                    };
                }
            } else {
                delete payload.card;
            }

            const createPayment = await gatewayService.createPayment(payload);

            if (createPayment) {
                const payment = await paymentService.createPayment({
                    userId,
                    companyId,
                    amount,
                    description,
                    invoice: createPayment.id
                });

                if (cardDetails) {
                    const updatedPayment = await prismaClient.payment.update({
                        where: { id: payment.id },
                        data: {
                            status: createPayment.status,
                            paymentType: createPayment.payment_method_type,
                            paymentMethodId: createPayment.payment_method_id,
                            cardBrand: createPayment.card.brand
                        }
                    })
                    return res.status(201).json(updatedPayment);
                }
                else {
                    const updatedPayment = await prismaClient.payment.update({
                        where: { id: payment.id },
                        data: {
                            redirectUrl: createPayment.redirect_url ? createPayment.redirect_url : createPayment.ticket.image_url,
                            paymentType: createPayment.payment_method_type,
                            paymentMethodId: createPayment.payment_method_id,
                            paymentData: createPayment.payment_method_flow === 'REDIRECT' ? undefined : {
                                number: createPayment.ticket.number,
                                expirationDate: createPayment.ticket.expiration_date,
                                id: createPayment.ticket.id,
                                barcode: createPayment.ticket.barcode,
                                company_name: createPayment.ticket.company_name,
                                company_id: createPayment.ticket.company_id,
                                imageUrl: createPayment.ticket.image_url
                            }
                        }
                    })
                    return res.status(201).json(updatedPayment);
                }
            }
        } catch (error) {
            console.error('Error creating payment:', error);
            return res.status(500).json({ error: 'Failed to create payment: ' + error });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { paymentId, userId, amount, description } = req.body;
            const { companyId } = req

            const payment = await paymentService.updatePayment({
                paymentId,
                userId,
                companyId,
                amount,
                description,
            });

            return res.json(payment);
        } catch (error) {
            console.error("Error updating payment:", error);
            return res.status(500).json({ error: "Failed to update payment" });
        }
    }

    async notification(req: Request, res: Response) {
        try {
            const { id, status } = req.body;
            const findOrder = await prismaClient.order.findFirst({
                where: {
                    invoice: id
                }
            })

            if (findOrder) {
                console.info(`Receiving a notification from the order id ${findOrder.id} with the status: ${status}`)
                const order = await orderService.update({
                    orderId: findOrder.id,
                    status: status
                });
                console.info(`The updated payment info: ${JSON.stringify(order)}`)
                return res.json(order);
            }

        } catch (error) {
            console.error("Error updating payment:", error);
            return res.status(500).json({ error: "Failed to update payment" });
        }
    }

    async getAllPayments(req: Request, res: Response) {
        try {
            const payments = await paymentService.getAllPayments();

            return res.json(payments);
        } catch (error) {
            console.error("Error retrieving payments:", error);
            return res.status(500).json({ error: "Failed to retrieve payments" });
        }
    }

    async getPaymentsByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            const payments = await paymentService.getPaymentsByUser(userId);

            return res.json(payments);
        } catch (error) {
            console.error("Error retrieving payments by user:", error);
            return res.status(500).json({ error: "Failed to retrieve payments by user" });
        }
    }

    async getPaymentsByCompany(req: Request, res: Response) {
        try {
            const { companyId } = req.params;

            const payments = await paymentService.getPaymentsByCompany(companyId);

            return res.json(payments);
        } catch (error) {
            console.error("Error retrieving payments by company:", error);
            return res.status(500).json({ error: "Failed to retrieve payments by company" });
        }
    }
}

export { PaymentController };
