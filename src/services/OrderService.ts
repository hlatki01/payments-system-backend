import { AllowedCountries, AllowedCurrencies, PaymentStatus, PaymentType } from "@prisma/client";
import prismaClient from "../prisma";

interface OrderRequest {
    orderId?: string;
    orderNumber?: string;
    userId?: string;
    companyId?: string;
    productIds?: string[];
    status?: PaymentStatus;
    paymentType?: PaymentType;
    paymentMethodId?: string;
    country?: AllowedCountries;
    currency?: AllowedCurrencies;
    payerName?: string
    payerDocument?: string
    payerEmail?: string
    paymentData?: Record<string, any>;
    invoice?: string;
}


class OrderService {
    async create({ orderNumber, userId, companyId, productIds, payerName }: OrderRequest) {
        try {
            if (!orderNumber || !userId || !companyId || !productIds || !payerName || productIds.length === 0) {
                throw new Error("Order number, user ID, company ID, and product IDs are mandatory");
            }

            const checkOrderNumber = await prismaClient.order.findFirst({
                where: { orderNumber: orderNumber }
            })

            if (checkOrderNumber) {
                throw new Error("Order number já existe");
            }

            const order = await prismaClient.order.create({
                data: {
                    orderNumber: orderNumber,
                    userId: userId,
                    companyId: companyId,
                    payerName: payerName,
                    products: {
                        connect: productIds.map((productId) => ({ id: productId })),
                    },
                },
            });

            return order;
        } catch (error) {
            throw new Error(`Order creation failed: ${error.message}`);
        }
    }

    async update({ orderId, orderNumber, userId, companyId, paymentMethodId, status, country, currency, payerDocument, payerEmail, payerName, paymentType, paymentData, invoice }: OrderRequest) {
        try {
            const order = await prismaClient.order.update({
                data: {
                    orderNumber,
                    userId,
                    companyId,
                    payerDocument,
                    currency,
                    country,
                    paymentMethodId,
                    payerEmail,
                    payerName,
                    status,
                    paymentType,
                    paymentData,
                    invoice
                },
                where: {
                    id: orderId,
                },
            });

            return order;
        } catch (error) {
            throw new Error(`Order update failed: ${error.message}`);
        }
    }

    async one({ orderId }: OrderRequest) {
        try {
            const order = await prismaClient.order.findFirst({
                where: {
                    id: orderId,
                },
                include: {
                    products: true,
                },
            });

            if (!order) {
                throw new Error("Order not found");
            }

            return order;
        } catch (error) {
            throw new Error(`Fetching order failed: ${error.message}`);
        }
    }

    async delete({ orderId }: OrderRequest) {
        try {
            const order = await prismaClient.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    deleted: true,
                },
            });

            if (!order) {
                throw new Error("Order not found");
            }

            return order;
        } catch (error) {
            throw new Error(`Order deletion failed: ${error.message}`);
        }
    }
}

export { OrderService };
