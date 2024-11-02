import { z } from "zod";

const stepSchema = z.object({
  id: z.string().uuid().optional(), // Optional, since it may not be provided on creation
  number: z.number().int().positive(), // Step number should be a positive integer
  description: z.string().min(1), // Minimum length for step description
  // Additional fields related to TestCase if needed
});

const flowSchema = z.object({
  id: z.string().uuid().optional(), // Optional, since it may not be provided on creation
  name: z.string().min(1), // Minimum length for flow name
  steps: z.array(stepSchema), // Array of Step objects
});

export const formSchema = z.object({
  displayId: z.string().min(2), // Unique identifier
  name: z.string().min(5), // Minimum length for the name
  description: z.string().min(10), // Minimum length for the description
  entries: z.array(z.string()), // Array of strings
  preconditions: z.array(z.string()), // Array of preconditions
  postconditions: z.array(z.string()), // Array of postconditions
  mainFlow: z.array(flowSchema), // Array of Flow objects for main flow
  alternateFlows: z.array(flowSchema), // Array of Flow objects for alternate flows
  projectId: z.string().uuid(), // Ensure projectId is a valid UUID
});
