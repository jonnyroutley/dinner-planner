import { createTRPCRouter } from "~/server/api/trpc";
import { dinnerRouter } from "./routers/dinners";
import { userRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // example: exampleRouter,
  dinner: dinnerRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
