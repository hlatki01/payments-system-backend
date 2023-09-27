import { Request, Response } from "express";
import { LogsService } from "../services/LogsService";

const logsService = new LogsService();

class LogsController {
    async create(req: Request, res: Response) {
        try {
            const { action, details, userId, companyId } = req.body;

            const log = await logsService.createLog({
                action,
                details,
                userId,
                companyId,
            });

            return res.status(201).json(log);
        } catch (error) {
            console.error("Error creating log entry:", error);
            return res.status(500).json({ error: "Failed to create log entry" });
        }
    }

    async getAllLogs(req: Request, res: Response) {
        try {
            const logs = await logsService.getAllLogs();

            return res.json(logs);
        } catch (error) {
            console.error("Error retrieving logs:", error);
            return res.status(500).json({ error: "Failed to retrieve logs" });
        }
    }

    async getLogsByUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            const logs = await logsService.getLogsByUser(userId);

            return res.json(logs);
        } catch (error) {
            console.error("Error retrieving logs by user:", error);
            return res.status(500).json({ error: "Failed to retrieve logs by user" });
        }
    }

    async getLogsByCompany(req: Request, res: Response) {
        try {
            const { companyId } = req.params;

            const logs = await logsService.getLogsByCompany(companyId);

            return res.json(logs);
        } catch (error) {
            console.error("Error retrieving logs by company:", error);
            return res.status(500).json({ error: "Failed to retrieve logs by company" });
        }
    }
}

export default LogsController;
