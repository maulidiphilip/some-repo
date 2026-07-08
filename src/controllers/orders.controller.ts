import { NextFunction, Request, Response } from "express";
import * as ordersService from "../services/orders.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const orders = await ordersService.listOrdersForUser(req.user!.userId);
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const order = await ordersService.getOrderById(req.params.id as string, req.user!.userId);
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ordersService.createOrder(req.user!.userId, req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}