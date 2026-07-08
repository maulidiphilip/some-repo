import { NextFunction, Request, Response } from "express";
import * as ticketTypesService from "../services/ticketTypes.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const ticketTypes = await ticketTypesService.listTicketTypes(req.params.eventId as string);
    res.json(ticketTypes);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const ticketType = await ticketTypesService.createTicketType(req.params.eventId as string, req.body);
    res.status(201).json(ticketType);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const ticketType = await ticketTypesService.updateTicketType(req.params.ticketTypeId as string, req.body);
    res.json(ticketType);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await ticketTypesService.deleteTicketType(req.params.ticketTypeId as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}