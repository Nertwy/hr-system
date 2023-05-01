import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.example.findMany();
  }),
  getPerson: publicProcedure.query(()=>{
    const people = [
      { id: 1, name: "Wade Cooper" },
      { id: 2, name: "Arlene Mccoy" },
      { id: 3, name: "Devon Webb" },
      { id: 4, name: "Tom Cook" },
      { id: 5, name: "Tanya Fox" },
      { id: 6, name: "Hellen Schmidt" },
    ];
    return people
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "Тепер ви можете бачити цей секретний месендж!";
  }),
  getAllVacancies: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.vacancy.findMany();
  }),
  candidateCreate: protectedProcedure
    .input(
      z.object({
        id: z.number().int().optional(),
        vacancyId: z.number().optional(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        application_date: z.date(),
        status: z.string(),
        comments: z.string().optional(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const user = await prisma.candidate.create({
        data: {
          ...input,
        },
      });
      return user;
    }),
});
