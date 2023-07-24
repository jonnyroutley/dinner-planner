import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const dinnerRouter = createTRPCRouter({
  getFortnight: publicProcedure.query(({ ctx }) => {
    // return ctx.prisma.dinner.findMany();
    return ctx.prisma.dinner.findMany({
      where: {
        date: {
          lte: new Date("2023-08-31"),
          gte: new Date("2023-08-24"),
        },
      },
      include: {
        users: true,
      },
    });
  }),

  addAttendance: publicProcedure
    .input(
      z.object({
        dinnerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // const userId = ctx.userId
      const res = await ctx.prisma.dinner.update({
        where: {
          id: input.dinnerId,
        },
        data: {
          users: {
            disconnect: { id: ctx.session.user.userId },
          },
        },
      });
    }),
  // removeAttendance
});
