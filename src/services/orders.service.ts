import { prisma } from "../lib/prisma";
import { stripe } from "../lib/stripe";
import { ApiError } from "../middleware/error.middleware";
import { CreateOrderInput } from "../schemas/orders.schema";

// Creates a PENDING order + a Stripe Checkout Session.
// The order is confirmed later by the Stripe webhook handler, not here directly -
// that way the order state always reflects what Stripe actually charged.
export async function createOrder(userId: string, input: CreateOrderInput) {
  const ticketTypeIds = input.items.map((i) => i.ticketTypeId);

  const ticketTypes = await prisma.ticketType.findMany({
    where: { id: { in: ticketTypeIds } },
  });

  if (ticketTypes.length !== ticketTypeIds.length) {
    throw new ApiError(404, "One or more ticket types not found");
  }

  const orderItemsData = input.items.map((item) => {
    const ticketType = ticketTypes.find((t) => t.id === item.ticketTypeId)!;

    if (ticketType.quantity < item.quantity) {
      throw new ApiError(400, `Not enough tickets available for ${ticketType.name}`);
    }

    return {
      ticketTypeId: ticketType.id,
      quantity: item.quantity,
      unitPriceCents: ticketType.priceCents,
    };
  });

  const totalCents = orderItemsData.reduce(
    (sum, item) => sum + item.unitPriceCents * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      status: "PENDING",
      totalCents,
      items: { create: orderItemsData },
    },
    include: { items: true },
  });

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: orderItemsData.map((item) => {
      const ticketType = ticketTypes.find((t) => t.id === item.ticketTypeId)!;
      return {
        price_data: {
          currency: "usd",
          product_data: { name: ticketType.name },
          unit_amount: item.unitPriceCents,
        },
        quantity: item.quantity,
      };
    }),
    success_url: `${process.env.CLIENT_URL}/orders/${order.id}/success`,
    cancel_url: `${process.env.CLIENT_URL}/orders/${order.id}/cancelled`,
    metadata: { orderId: order.id },
  });

  await prisma.order.update({
    where: { id: order.id },
    data: { stripeSessionId: session.id },
  });

  return { order, checkoutUrl: session.url };
}

export async function getOrderById(id: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!order || order.userId !== userId) {
    throw new ApiError(404, "Order not found");
  }

  return order;
}

export function listOrdersForUser(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
}

// Called from the Stripe webhook handler on checkout.session.completed
export async function markOrderPaid(stripeSessionId: string) {
  const order = await prisma.order.findFirst({ where: { stripeSessionId } });

  if (!order) {
    throw new ApiError(404, `No order found for Stripe session ${stripeSessionId}`);
  }

  return prisma.order.update({
    where: { id: order.id },
    data: { status: "PAID" },
  });
}
