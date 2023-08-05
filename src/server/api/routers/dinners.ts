import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const dinnerRouter = createTRPCRouter({
  getFortnight: protectedProcedure.query(({ ctx }) => {
    const today = new Date();
    today.setUTCHours(0,0,0,0)
    const todayPlusTwoWeeks = new Date(Date.now() + 12096e5);
    console.log(today, todayPlusTwoWeeks)
    // return ctx.prisma.dinner.findMany();
    return ctx.prisma.dinner.findMany({
      where: {
        date: {
          gte: today,
          lte: todayPlusTwoWeeks,
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

  addMissingDates: publicProcedure
    .input(
      z.object({
        finalDate: z.date(),
        numMissing: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log('made it')
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const nextDate = new Date();
      nextDate.setUTCDate(input.finalDate.getUTCDate());
      nextDate.setUTCHours(0,0,0,0)

      for (let i = 0; i < input.numMissing; i++) {
        nextDate.setUTCDate(nextDate.getUTCDate() + 1);
        const dinner = await ctx.prisma.dinner.create({
          data: {
            date: nextDate,
            name: days[nextDate.getDay()]!,
            time: "19:00",
          },
        });
        console.log('here', i)
        console.log(dinner)
 
      }
    }),
});
