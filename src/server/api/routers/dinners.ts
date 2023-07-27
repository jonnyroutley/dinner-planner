import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dinnerRouter = createTRPCRouter({
  getFortnight: protectedProcedure.query(({ ctx }) => {
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

  removeAttendance: protectedProcedure
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
            disconnect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  addAttendance: protectedProcedure
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
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  setCooking: protectedProcedure
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
          cook: {
            connect: { id: ctx.session.user.id },
          },
        },
      });
    }),

  removeCooking: protectedProcedure
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
          cook: {
            disconnect: true,
          },
        },
      });
    }),
});
