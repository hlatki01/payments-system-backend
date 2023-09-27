// loggingMiddleware.js
import { verify } from "jsonwebtoken";
import { LogsService } from "../services/LogsService"; // Ensure the correct path to your service file
import prismaClient from "../prisma";

interface Payload {
    sub: string;
}

const logsService = new LogsService();

async function logRequest(req, res, next) {

    try {
        const authToken = req.headers.authorization;
        if (authToken && !authToken.includes('V2-HMAC-SHA256')) {
            const [, token] = authToken.split(" ");
            // Validate the token
            const { sub } = verify(token, process.env.JWT_SECRET) as Payload;

            // Retrieve the user information
            const user = await prismaClient.user.findFirst({
                where: {
                    id: sub,
                },
            });

            const logEntry = {
                action: 'Request',
                details: `Request to ${req.method} ${req.path} from IP ${req.ip}, body: ${JSON.stringify(req.body)}, userName: ${user.name}, userEmail: ${user.email}`,
                userId: user.id, // If this request is associated with a user, provide the user ID here
                companyId: user.companyId, // If this request is associated with a company, provide the company ID here
            };

            // Save the log entry in the database
            await logsService.createLog(logEntry);

        }
        next(); // Continue processing the request
    } catch (error) {
        console.error('Error logging request:', error);
        next(error); // Pass the error to the error handling middleware
    }
}

export default logRequest;
