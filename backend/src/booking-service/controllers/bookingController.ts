import { Request,Response} from "express";
import prisma from "../../shared/config/db";

//createBooking controller

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




// departbooking controller

export const departBooking = async(req:Request,res:Response)=>{
    try{
        const {refId} = req.params;

        const booking = await prisma.booking.update({
            where: {refId},
            data: {status: "DEPARTED"},
        });

        await prisma.bookingEvent.create({
            data:{
                type: "DEPARTED",
                location: booking.origin,
                bookingId: booking.id,
            },
        });

        res.status(200).json({success: true,booking});
    }catch(err){
        res.status(500).json({ error: "Failed to mark booking as departed" });
    }
};



// arrivebooking contorller

export const arriveBooking = async (req: Request,res: Response)=>{
    try{
        const {refId}=req.params;

        const booking = await prisma.booking.update({
            where: {refId},
            data: {status: "ARRIVED"},
        });

        await prisma.bookingEvent.create({
            data:{
                type: "ARRIVED",
                location: booking.destination,
                bookingId: booking.id,
            },
        });
        res.status(200).json({success: true,booking});
    }catch(err){
        res.status(500).json({ error: "Failed to mark booking as arrived" });
    }
};


// getbokingHistory 

export const getBookingHistory = async(req: Request,res: Response)=>{
    try{
        const {refId}=req.params;
        const booking = await prisma.booking.findUnique({
            where: {refId},
            include: {events: {orderBy: {timeStamp:"asc"}}},
        });
        res.status(200).json({success: true,booking});
    }catch(err){
        res.status(500).json({ error: "Failed to fetch booking history" });
    }
};


//cancelBooking

export const cancelBooking = async(req:Request,res:Response)=>{
    try{
        const {refId}=req.params;

        const booking = await prisma.booking.findUnique({where: {refId}});

        if(!booking) return res.status(404).json({error: "Booking not found" });

        if(booking.status === "ARRIVED")
            return res.status(400).json({ error: "Cannot cancel after arrival" });

        const updatedBooking = await prisma.booking.update({
            where: { refId },
            data: { status:"CANCELLED"},
        });

        await prisma.bookingEvent.create({
            data:{
                type: "CANCELLED",
                location: booking.origin,
                bookingId: booking.id,
            },
        });

        res.status(200).json({success: true,updatedBooking});
    }catch(err){
        res.status(500).json({ error: "Failed to cancel booking" });
    }
};