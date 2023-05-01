import {z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";

export const CRUD = createTRPCRouter({
  getAllVacancies: protectedProcedure.query(async () => {
    const vacancies = await prisma.vacancy.findMany();
    return vacancies;
  }),
  createVacancy: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        department: z.string(),
        description: z.string(),
        requirements: z.string(),
        posting_date: z.date(),
        closing_date: z.date(),
        status: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const vacancy = await prisma.vacancy.create({
        data: {
          ...input,
        },
      });
      return vacancy;
    }),
  deleteVacancy: protectedProcedure.input(z.number()).mutation(async (opts) => {
    const { input } = opts;
    const vacancy = await prisma.vacancy.delete({
      where: {
        id: input,
      },
      include: {
        candidates: true,
      },
    });
    return vacancy
  }),
});
