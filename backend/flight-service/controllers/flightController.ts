import { Request, Response } from "express";
import * as flightService from '../services/flightService';



//createflight controller
export const createFlight = async (req: Request, res: Response) => {
  try {
    const flight = await flightService.createFlight(req.body);
    res.status(200).json({success: true,flight});
  } catch (error) {
    res.status(500).json({ error: "Failed to create flight" });
  }
};


///getall flight controller
export const getAllFlights = async (_: Request, res: Response) => {
  try {
    const flights = await flightService.getAllFlights();
    
    res.status(200).json({success: true,flights});
  }catch (error){
    res.status(500).json({ error: "Failed to fetch flights" });
  }
};

//getflightbyno controller
export const getFlightByNo = async (req: Request, res: Response) => {
  try {
    const flight = await flightService.getFlightByNo(req.params.flightNo);
    if (!flight) return res.status(404).json({ error: "Flight not found" });
    res.status(200).json({success: true,flight});
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch flight" });
  }
};


//marking depart controller
export const departFlight = async (req: Request, res: Response) => {
  try {
    const flight = await flightService.updateFlightStatus(req.params.flightNo, "DEPARTED");
    res.status(200).json({success: true,flight});
  } catch (error) {
    res.status(500).json({ error: "Failed to mark flight as departed" });
  }
};


//marking arrive controller
export const arriveFlight = async (req: Request, res: Response) => {
  try {
    const flight = await flightService.updateFlightStatus(req.params.flightNo, "ARRIVED");
    res.status(200).json({success: true,flight});
  } catch (error) {
    res.status(500).json({ error: "Failed to mark flight as arrived" });
  }
};


//cancel flight controller
export const cancelFlight = async (req: Request, res: Response) => {
  try {
    const flight = await flightService.updateFlightStatus(req.params.flightNo, "CANCELLED");
     res.status(200).json({success: true,flight});
  } catch (error) {
    res.status(500).json({ error: "Failed to cancel flight" });
  }
};
