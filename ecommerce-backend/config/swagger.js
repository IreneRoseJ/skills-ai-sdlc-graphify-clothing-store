import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const port = process.env.PORT || 3000;
const serverUrl =
    process.env.API_PUBLIC_URL?.trim() || `http://localhost:${port}`;

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Clothing Store API",
            version: "1.0.0",
            description:
                "E-commerce REST API. Protected routes require a `jwt` httpOnly cookie from POST /api/users/login.",
        },
        servers: [{ url: serverUrl }],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "jwt",
                    description: "Login via POST /api/users/login",
                },
            },
        },
    },
    apis: [path.join(__dirname, "..", "swagger", "*.js")],
};

export const swaggerSpec = swaggerJsdoc(options);

 