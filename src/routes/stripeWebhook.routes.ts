import { Router } from "express";
import express from "express";
import Stripe from "stripe";
import { stripe } from "../lib/stripe";
import * as ordersService from "../services/orders.service";

export const stripeWebhookRouter = Router();

// IMPORTANT: this route needs the raw request body to verify the Stripe
// signature, so it must be mounted BEFORE express.json() in app.ts,
// and it uses express.raw() instead of the global JSON parser.
stripeWebhookRouter.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const signature = req.headers["stripe-signature"] as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err) {
      console.error("Stripe webhook signature verification failed", err);
      return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      await ordersService.markOrderPaid(session.id);
    }

    res.json({ received: true });
  }
);
