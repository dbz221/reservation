import { 
  users, 
  type User, 
  type InsertUser, 
  appointments, 
  type Appointment, 
  type InsertAppointment 
} from "@shared/schema";
import { db } from "./db";
import { eq, like, desc } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Appointment methods
  getAllAppointments(): Promise<Appointment[]>;
  getAppointmentByUniqueId(uniqueId: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(uniqueId: string, appointment: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  searchAppointments(searchParam: string, searchValue: string): Promise<Appointment[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    // Get all appointments sorted by creation date (newest first)
    return await db.select().from(appointments).orderBy(desc(appointments.createdAt));
  }

  async getAppointmentByUniqueId(uniqueId: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.uniqueId, uniqueId));
    return appointment;
  }

  async createAppointment(appointmentData: InsertAppointment): Promise<Appointment> {
    const [appointment] = await db
      .insert(appointments)
      .values({
        ...appointmentData,
        // Ensure null values for optional fields when they're undefined
        appointmentDate: appointmentData.appointmentDate || null,
        appointmentTime: appointmentData.appointmentTime || null
      })
      .returning();
    return appointment;
  }

  async updateAppointment(uniqueId: string, appointmentData: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    // Handle optional fields to ensure they're set to null when undefined
    const dataToUpdate: Record<string, any> = { ...appointmentData };
    if ('appointmentDate' in dataToUpdate && dataToUpdate.appointmentDate === undefined) {
      dataToUpdate.appointmentDate = null;
    }
    if ('appointmentTime' in dataToUpdate && dataToUpdate.appointmentTime === undefined) {
      dataToUpdate.appointmentTime = null;
    }
    
    const [updatedAppointment] = await db
      .update(appointments)
      .set(dataToUpdate)
      .where(eq(appointments.uniqueId, uniqueId))
      .returning();
    
    return updatedAppointment;
  }

  async searchAppointments(searchParam: string, searchValue: string): Promise<Appointment[]> {
    if (searchParam === 'uniqueId') {
      return await db
        .select()
        .from(appointments)
        .where(like(appointments.uniqueId, `%${searchValue}%`))
        .orderBy(desc(appointments.createdAt));
    }
    
    // For other parameters, this is a simple example.
    // In a real app, you'd add search capabilities for other fields based on requirements
    return await this.getAllAppointments();
  }
}

// Switch to database storage
export const storage = new DatabaseStorage();
