import { Request, Response } from "express";
import { GatewayService } from "../services/GatewayService";

const gatewayService = new GatewayService();


class GatewayController {
    async getPaymentMethods(req: Request, res: Response) {
        try {
            const { iso } = req.params;
            const paymentMethods = await gatewayService.getPaymentMethods({ iso });
            res.json(paymentMethods);
        } catch (error) {
            console.error("Error in create:", error);
            res.status(500).json({ error: "An error occurred while creating an order. Error: " + error });
        }
    }

    async getCurrencyExchange(req: Request, res: Response) {
        try {
            const { currency } = req.params;
            const paymentMethods = await gatewayService.getCurrencyExchange({ currency });
            res.json(paymentMethods);
        } catch (error) {
            console.error("Error in create:", error);
            res.status(500).json({ error: "An error occurred while creating an order. Error: " + error });
        }
    }
}

export { GatewayController };
