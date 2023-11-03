import { PrismaClient } from "@prisma/client";
import { jobOrders, offices, regulars } from "./data";

const prisma = new PrismaClient();

async function main() {
  console.log("Account creation");
  await fetch("http://localhost:3000/api/auth/admin-creation", {
    method: "POST",
    body: JSON.stringify({}),
  });
  console.log("Admin account created");

  console.log("Seeding data");

  await addOffices();
  await addRegulars();
  await addJobOrders();

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

async function addRegulars() {
  for (const r of regulars) {
    const regular = await prisma.employee.create({
      data: {
        firstName: r.firstName,
        middleName: r.middleName,
        lastName: r.lastName,
        extensionName: r.extensionName,
        position: r.position?.trim(),
        genericPosition: r.genericPosition?.trim(),
        officeAcronym: r.office.trim().toUpperCase(),
        officeAssignmentAcronym: r.officeAssignment.trim().toUpperCase(),
        employmentStatus: "REGULAR",
      },
    });
    console.log(`Created user with id: ${regular.id}`);
  }
}

async function addJobOrders() {
  for (const j of jobOrders) {
    const jobOrder = await prisma.employee.create({
      data: {
        firstName: j.firstName,
        middleName: j.middleName,
        lastName: j.lastName,
        extensionName: j.extensionName,
        position: j.position?.trim(),
        genericPosition: j.genericPosition?.trim(),
        officeAcronym: j.office.trim().toUpperCase(),
        officeAssignmentAcronym: j.officeAssignment.trim().toUpperCase(),
        employmentStatus: "JOBORDER",
      },
    });
    console.log(`Created user with id: ${jobOrder.id}`);
  }
}

async function addOffices() {
  for (const o of offices) {
    const office = await prisma.office.create({
      data: {
        acronym: o.toUpperCase(),
      },
    });
    console.log(`Created user with id: ${office.acronym}`);
  }
}
