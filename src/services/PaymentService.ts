import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class PaymentService {
  async createPayment({ userId, companyId, amount, description, invoice }) {
    try {
      const payment = await prisma.payment.create({
        data: {
          userId: userId,
          companyId: companyId,
          amount: amount,
          description: description,
          invoice
        },
      });

      return payment;
    } catch (error) {
      throw new Error(`Error creating payment: ${error.message}`);
    }
  }

  async updatePayment({ paymentId, userId, companyId, amount, description }) {
    try {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          userId: userId,
          companyId: companyId,
          amount: amount,
          description: description,
        },
      });

      return payment;
    } catch (error) {
      throw new Error(`Error updating payment: ${error.message}`);
    }
  }

  async updatePaymentStatus({ paymentId, status }) {
    try {
      const payment = await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status
        },
      });

      return payment;
    } catch (error) {
      throw new Error(`Error updating payment: ${error.message}`);
    }
  }

  async getAllPayments() {
    try {
      const payments = await prisma.payment.findMany();

      return payments;
    } catch (error) {
      throw new Error(`Error retrieving payments: ${error.message}`);
    }
  }

  async getPaymentsByUser(userId) {
    try {
      const payments = await prisma.payment.findMany({
        where: { userId: userId },
      });

      return payments;
    } catch (error) {
      throw new Error(`Error retrieving payments by user: ${error.message}`);
    }
  }

  async getPaymentsByCompany(companyId) {
    try {
      const payments = await prisma.payment.findMany({
        where: { companyId: companyId },
      });

      return payments;
    } catch (error) {
      throw new Error(`Error retrieving payments by company: ${error.message}`);
    }
  }
}

export default PaymentService;
