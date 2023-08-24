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
      orderBy: {date: 'asc'}
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


  createDinner: protectedProcedure
    .input(z.object({
      date: z.date()
    }))
    .mutation(async ({ ctx, input }) => {
      let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      const dinner = await ctx.prisma.dinner.create({
        data: {
          date: input.date,
          name: days[input.date.getDay()] || "",
          time: "19:00",
          users: {
            connect: [{id: "64ce4d4083d54c44d8bd32fd"}, {id: "64ce81fd7c73efb3566dd57f"}]
          }
        }
      })
      console.log(`dinner created for date: ${input.date}`)
      console.log(dinner)
    }), 

  updateTime: publicProcedure
    .input(
      z.object({
        dinnerId: z.string(),
        newTime: z.string().regex(new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d$/))
      })
    )
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.dinner.update({
        where: {
          id: input.dinnerId
        },
        data: {
          time: input.newTime
        }
      })
    })
});
