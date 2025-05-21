import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import * as z from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  uniqueId: text("unique_id").notNull().unique(),
  applicationDate: text("application_date").notNull(), // Persian date format: YYYY/MM/DD
  applicationTime: text("application_time").notNull(), // Time format: HH:MM
  paymentDate: text("payment_date").notNull(), // Persian date format: YYYY/MM/DD
  appointmentDate: text("appointment_date"), // Persian date format: YYYY/MM/DD (optional)
  appointmentTime: text("appointment_time"), // Time format: HH:MM (optional)
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;
