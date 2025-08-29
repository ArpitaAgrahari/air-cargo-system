import { Request,Response} from "express";
import {PrismaClient} from '@prisma/client';


const prisma = new PrismaClient();


export const createBooking = async (req: Request, res: Response) => {
    try{
        const {origin, destination, pieces, weight_kg}=req.body;

        const booking = await prisma.booking.create({
            data: {
                origin,
                destination,
                pieces,
                weight_kg,
            },
        });

        await prisma.bookingEvent.create({
            data:{
                type: "BOOKED",
                location: origin,
                bookingId: booking.id,
            },
        });

        res.status(200).json({success: true,booking});
    }catch(err){
        res.status(500).json({ error: "Failed to create booking" });
    }
};



