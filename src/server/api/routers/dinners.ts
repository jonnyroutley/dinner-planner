import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const dinnerRouter = createTRPCRouter({
    getFortnight: publicProcedure.query(({ ctx }) => {
        return ctx.prisma.dinner.findMany();
    })
})  