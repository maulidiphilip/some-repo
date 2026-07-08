import { NextFunction, Request, Response } from "express";
import * as eventsService from "../services/events.service";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const events = await eventsService.listEvents();
    res.json(events);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventsService.getEventById(req.params.id as string);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    // req.user is populated by requireAuth
    const event = await eventsService.createEvent(req.body, req.user!.userId);
    res.status(201).json(event);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const event = await eventsService.updateEvent(req.params.id as string, req.body);
    res.json(event);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await eventsService.deleteEvent(req.params.id as string);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}