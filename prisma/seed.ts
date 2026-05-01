import { PrismaClient } from "../node_modules/.prisma/client/default";

import { DEMO_JOBS } from "../src/lib/demo-jobs";

const prisma = new PrismaClient();

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@jobfit.local" },
    update: {},
    create: {
      email: "demo@jobfit.local",
      name: "Demo User",
    },
  });

  await prisma.resume.deleteMany({ where: { userId: demoUser.id } });
  await prisma.generatedDocument.deleteMany({ where: { userId: demoUser.id } });
  await prisma.application.deleteMany({ where: { userId: demoUser.id } });
  await prisma.jobMatch.deleteMany({ where: { userId: demoUser.id } });
  await prisma.job.deleteMany({});

  await prisma.candidateProfile.upsert({
    where: { userId: demoUser.id },
    update: {
      fullName: "Demo User",
      email: "demo@jobfit.local",
      phone: "+1 415 555 0110",
      location: "San Francisco, USA",
      jobTitles: ["Full Stack Developer", "Product Engineer"],
      skills: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "Prisma",
      ],
      toolsAndTechnologies: ["Docker", "GitHub Actions", "AWS", "Tailwind"],
      yearsOfExperience: 6,
      education: ["B.Sc. Computer Science, UCLA"],
      certifications: ["AWS Certified Developer Associate"],
      languages: ["English", "Spanish"],
      projects: [
        "Built a job analytics dashboard used by 20k monthly users.",
        "Migrated monolith services to modular Node.js APIs.",
      ],
      summary:
        "Product-minded full-stack engineer with 6 years of experience shipping SaaS platforms.",
    },
    create: {
      userId: demoUser.id,
      fullName: "Demo User",
      email: "demo@jobfit.local",
      phone: "+1 415 555 0110",
      location: "San Francisco, USA",
      jobTitles: ["Full Stack Developer", "Product Engineer"],
      skills: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "Prisma",
      ],
      toolsAndTechnologies: ["Docker", "GitHub Actions", "AWS", "Tailwind"],
      yearsOfExperience: 6,
      education: ["B.Sc. Computer Science, UCLA"],
      certifications: ["AWS Certified Developer Associate"],
      languages: ["English", "Spanish"],
      projects: [
        "Built a job analytics dashboard used by 20k monthly users.",
        "Migrated monolith services to modular Node.js APIs.",
      ],
      summary:
        "Product-minded full-stack engineer with 6 years of experience shipping SaaS platforms.",
    },
  });

  await prisma.jobPreference.upsert({
    where: { userId: demoUser.id },
    update: {
      desiredJobTitles: [
        "Full Stack Developer",
        "Product Engineer",
        "AI Engineer",
      ],
      preferredLocations: ["Remote", "San Francisco", "Berlin"],
      remotePreference: ["remote", "hybrid"],
      salaryExpectation: "$140k - $180k",
      seniorityLevel: ["mid", "senior"],
      employmentTypes: ["full-time"],
      preferredIndustries: ["SaaS", "Fintech", "AI"],
      visaNotes: "US work authorization available.",
      excludedKeywordsOrCompanies: ["Unpaid", "Stealth Corp"],
      preferredTechStack: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "AWS",
      ],
    },
    create: {
      userId: demoUser.id,
      desiredJobTitles: [
        "Full Stack Developer",
        "Product Engineer",
        "AI Engineer",
      ],
      preferredLocations: ["Remote", "San Francisco", "Berlin"],
      remotePreference: ["remote", "hybrid"],
      salaryExpectation: "$140k - $180k",
      seniorityLevel: ["mid", "senior"],
      employmentTypes: ["full-time"],
      preferredIndustries: ["SaaS", "Fintech", "AI"],
      visaNotes: "US work authorization available.",
      excludedKeywordsOrCompanies: ["Unpaid", "Stealth Corp"],
      preferredTechStack: [
        "TypeScript",
        "React",
        "Next.js",
        "Node.js",
        "PostgreSQL",
        "AWS",
      ],
    },
  });

  const mapWorkMode = (mode: "remote" | "hybrid" | "on-site") => {
    if (mode === "on-site") return "on_site";
    return mode;
  };

  const mapEmploymentType = (
    type: "full-time" | "part-time" | "contract" | "internship" | "freelance",
  ) => {
    if (type === "full-time") return "full_time";
    if (type === "part-time") return "part_time";
    return type;
  };

  const mapSource = (
    source:
      | "Greenhouse demo"
      | "Lever demo"
      | "Company Careers demo"
      | "Search Result demo"
      | "Manual Entry demo",
  ) => {
    if (source === "Greenhouse demo") return "greenhouse_demo";
    if (source === "Lever demo") return "lever_demo";
    if (source === "Company Careers demo") return "company_careers_demo";
    if (source === "Search Result demo") return "search_result_demo";
    return "manual_entry_demo";
  };

  for (const job of DEMO_JOBS) {
    await prisma.job.upsert({
      where: { id: job.id },
      update: {
        title: job.title,
        company: job.company,
        location: job.location,
        remoteType: mapWorkMode(job.remoteType),
        seniority: job.seniority,
        employmentType: mapEmploymentType(job.employmentType),
        industry: job.industry,
        description: job.description,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        applyUrl: job.applyUrl,
        source: mapSource(job.source),
        postedAt: new Date(job.postedAt),
      },
      create: {
        id: job.id,
        title: job.title,
        company: job.company,
        location: job.location,
        remoteType: mapWorkMode(job.remoteType),
        seniority: job.seniority,
        employmentType: mapEmploymentType(job.employmentType),
        industry: job.industry,
        description: job.description,
        requiredSkills: job.requiredSkills,
        preferredSkills: job.preferredSkills,
        applyUrl: job.applyUrl,
        source: mapSource(job.source),
        postedAt: new Date(job.postedAt),
      },
    });
  }

  console.log("Seed complete");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
