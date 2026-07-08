import express from "express";
import cors from "cors";
import { apiRouter } from "./routes";
import { stripeWebhookRouter } from "./routes/stripeWebhook.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

export const app = express();

app.use(cors());

// Stripe webhook needs the raw body, so it's mounted BEFORE express.json()
app.use("/api/webhooks/stripe", stripeWebhookRouter);

app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);
