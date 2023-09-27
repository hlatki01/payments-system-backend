import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class LogsService {
    async createLog({ action, details, userId, companyId }) {
        try {
            const log = await prisma.logs.create({
                data: {
                    action,
                    details,
                    userId,
                    companyId,
                },
            });

            return log;
        } catch (error) {
            throw new Error(`Error creating log entry: ${error.message}`);
        }
    }

    async getAllLogs() {
        try {
            const logs = await prisma.logs.findMany();

            return logs;
        } catch (error) {
            throw new Error(`Error retrieving logs: ${error.message}`);
        }
    }

    async getLogsByUser(userId) {
        try {
            const logs = await prisma.logs.findMany({
                where: { userId },
            });

            return logs;
        } catch (error) {
            throw new Error(`Error retrieving logs by user: ${error.message}`);
        }
    }

    async getLogsByCompany(companyId) {
        try {
            const logs = await prisma.logs.findMany({
                where: { companyId },
            });

            return logs;
        } catch (error) {
            throw new Error(`Error retrieving logs by company: ${error.message}`);
        }
    }
}

export { LogsService };
