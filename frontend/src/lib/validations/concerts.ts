import { z } from "zod";

export const createConcertSchema = z.object({
  name: z.string().min(1, "Concert name is required"),
  totalSeats: z.number({ message: "Must be a valid number" }).min(1, "Must have at least 1 seat"),
  description: z.string().min(1, "Description is required"),
});

export type CreateConcertFormData = z.infer<typeof createConcertSchema>;
