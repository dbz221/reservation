import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";
import * as z from "zod";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Appointments API routes
  const appointmentsRouter = express.Router();
  
  // Get all appointments
  appointmentsRouter.get("/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointments" });
    }
  });

  // Get appointment by uniqueId
  appointmentsRouter.get("/appointments/:uniqueId", async (req, res) => {
    try {
      const { uniqueId } = req.params;
      const appointment = await storage.getAppointmentByUniqueId(uniqueId);
      
      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error fetching appointment" });
    }
  });

  // Create a new appointment
  appointmentsRouter.post("/appointments", async (req, res) => {
    try {
      // Generate a unique ID
      const uniqueId = `APT-${nanoid(8)}`;
      
      // Validate request body
      const appointmentData = {
        ...req.body,
        uniqueId
      };
      
      const result = insertAppointmentSchema.safeParse(appointmentData);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid appointment data", 
          errors: result.error.errors 
        });
      }
      
      const appointment = await storage.createAppointment(result.data);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({ message: "Error creating appointment" });
    }
  });

  // Update an appointment
  appointmentsRouter.put("/appointments/:uniqueId", async (req, res) => {
    try {
      const { uniqueId } = req.params;
      
      // Validate request body
      const appointmentUpdateSchema = insertAppointmentSchema.partial().omit({ uniqueId: true });
      const result = appointmentUpdateSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ 
          message: "Invalid appointment data", 
          errors: result.error.errors 
        });
      }
      
      const updatedAppointment = await storage.updateAppointment(uniqueId, result.data);
      
      if (!updatedAppointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }
      
      res.json(updatedAppointment);
    } catch (error) {
      res.status(500).json({ message: "Error updating appointment" });
    }
  });

  // Search appointments
  appointmentsRouter.get("/appointments/search/:param/:value", async (req, res) => {
    try {
      const { param, value } = req.params;
      
      const validParams = ["uniqueId", "applicationDate", "paymentDate", "appointmentDate"];
      if (!validParams.includes(param)) {
        return res.status(400).json({ message: "Invalid search parameter" });
      }
      
      const appointments = await storage.searchAppointments(param, value);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ message: "Error searching appointments" });
    }
  });

  // Register the appointments router with the /api prefix
  app.use("/api", appointmentsRouter);

  const httpServer = createServer(app);
  return httpServer;
}
