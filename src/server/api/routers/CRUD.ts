import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { prisma } from "~/server/db";

export const CRUD = createTRPCRouter({
  getAllVacancies: protectedProcedure.query(async () => {
    const vacancies = await prisma.vacancy.findMany();
    return vacancies;
  }),
  getAllCandidates: protectedProcedure.query(async () => {
    const candidates = await prisma.candidate.findMany();
    return candidates;
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
    return vacancy;
  }),
  changeVacancy: protectedProcedure
    .input(
      z.object({
        id: z.number().positive(),
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
      const vacancy = await prisma.vacancy.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
      return vacancy;
    }),
  deleteCandidate: protectedProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const { input } = opts;
      const candidate = await prisma.candidate.delete({
        where: {
          id: input,
        },
      });
      return candidate;
    }),
  changeCandidate: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        vacancyId: z.number().nullable(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string(),
        phone: z.string(),
        application_date: z.date(),
        status: z.string(),
        comments: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const candidate = await prisma.candidate.update({
        data: {
          ...input,
        },
        where: {
          id: input.id,
        },
      });
      return candidate
    }),
});
