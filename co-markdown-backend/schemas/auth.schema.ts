import { z } from 'zod';

export const googleLoginSchema = z.object({
  credential: z.string().min(1),
});

export type GoogleLoginInput = z.infer<
  typeof googleLoginSchema
>;