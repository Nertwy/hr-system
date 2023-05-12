import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { prisma } from "~/server/db";

export const CRUD = createTRPCRouter({
  deleteReview: protectedProcedure
    .input(z.number().int().positive())
    .mutation(async (opts) => {
      const { input } = opts;
      const review = await prisma.review.delete({
        where: {
          id: input,
        },
      });
      return review;
    }),
  changeReview: protectedProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        reviewerId: z.number().int().positive(),
        reviewDate: z.date(),
        reviewRating: z.number().positive(),
        reviewNotes: z.string(),
        employeeId: z.number().int().positive(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const review = await prisma.review.update({
        data: {
          ...input,
        },
        where: {
          id: input.id,
        },
      });
      return review;
    }),
  getAllReview: publicProcedure.query(async () => {
    const reviews = await prisma.review.findMany();
    return reviews;
  }),
  postReview: protectedProcedure
    .input(
      z.object({
        employeeId: z.number().int().positive(),
        reviewerId: z.number().int().positive(),
        reviewDate: z.date(),
        reviewRating: z.number().positive(),
        reviewNotes: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const review = await prisma.review.create({
        data: {
          ...input,
        },
      });
      return review;
    }),
  getAllResumes: publicProcedure.query(async () => {
    const resumes = await prisma.resume.findMany();
    return resumes;
  }),
  changeResume: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        experience: z.string(),
        education: z.string(),
        skills: z.string(),
        achievements: z.string(),
        candidate_id: z.number().int(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const resume = await prisma.resume.update({
        where: {
          id: input.id,
        },
        data: {
          ...input,
        },
      });
    }),
  deleteResume: protectedProcedure
    .input(z.number().int())
    .mutation(async (opts) => {
      const { input } = opts;
      const resume = await prisma.resume.delete({
        where: {
          id: input,
        },
      });
      return resume;
    }),
  postResume: protectedProcedure
    .input(
      z.object({
        experience: z.string(),
        education: z.string(),
        skills: z.string(),
        achievements: z.string(),
        candidate_id: z.number().int(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const resume = await prisma.resume.create({
        data: {
          ...input,
        },
      });
      return resume;
    }),
  changeDepartment: protectedProcedure
    .input(z.object({ id: z.number(), name: z.string() }))
    .mutation(async (opts) => {
      const { input } = opts;
      const department = await prisma.department.update({
        data: {
          ...input,
        },
        where: {
          id: input.id,
        },
      });
      return department;
    }),
  deleteDepartmnet: protectedProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const { input } = opts;
      const department = await prisma.department.delete({
        where: {
          id: input,
        },
        include: {
          employees: true,
        },
      });

      return department;
    }),
  changeEmployee: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        hire_date: z.date(),
        salary: z.number(),
        job_title: z.string(),
        department_id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const employee = await prisma.employee.update({
        data: {
          ...input,
        },
        where: {
          id: input.id,
        },
      });
      return employee;
    }),
  deleteEmployee: protectedProcedure
    .input(z.number())
    .mutation(async (opts) => {
      const { input } = opts;
      const employee = await prisma.employee.delete({
        where: {
          id: input,
        },
      });
      return employee;
    }),
  getAllEmployees: publicProcedure.query(async () => {
    const employees = await prisma.employee.findMany();
    return employees;
  }),
  postEmployee: protectedProcedure
    .input(
      z.object({
        first_name: z.string(),
        last_name: z.string(),
        email: z.string().email(),
        phone: z.string(),
        hire_date: z.date(),
        salary: z.number(),
        job_title: z.string(),
        department_id: z.number(),
      })
    )
    .mutation(async (opts) => {
      const { input } = opts;
      const employee = await prisma.employee.create({
        data: {
          ...input,
        },
      });
      return employee;
    }),
  getAllDepartment: publicProcedure.query(async () => {
    const department = await prisma.department.findMany();
    return department;
  }),
  postDepartment: protectedProcedure
    .input(z.string())
    .mutation(async (opts) => {
      const { input } = opts;
      const department = await prisma.department.create({
        data: {
          name: input,
        },
      });
      return department;
    }),
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
        title: z.string().optional(),
        department: z.string().optional(),
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
      return candidate;
    }),
});
