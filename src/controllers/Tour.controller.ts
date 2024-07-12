import { NextFunction, Request, Response } from "express";
import Tour from "../model/Tour.model";

export const getAllTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tours = await Tour.find()
        res.status(200).json({
            message: 'Get all tour is successfuly!',
            data: tours
        })
    } catch (error) {
        res.json({
            message: `An error occurred: ${error}`
        })
        next()
    }
}

export const createTour = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            message: 'Create a new tour successfully!',
            data: newTour
        })
    } catch (error) {
        res.json({
            message: `An error occurred: ${error}`
        })
        next() 
    }
}
