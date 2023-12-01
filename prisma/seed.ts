import { type EmploymentStatus, PrismaClient } from "@prisma/client";
import { employees, offices } from "./data";

const prisma = new PrismaClient();

async function main() {
  // console.log("Account creation");
  // await fetch("http://localhost:3000/api/auth/admin-creation", {
  //   method: "POST",
  //   body: JSON.stringify({}),
  // });
  // console.log("Admin account created");

  console.log("Seeding data");

  // await addOffices();
  await prisma.employee.deleteMany();
  await addEmployees();

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

async function addEmployees() {
  for (const e of employees) {
    const regular = await prisma.employee.create({
      data: {
        firstName: e.firstName,
        middleName: e.middleName,
        lastName: e.lastName,
        extensionName: e.extensionName,
        officeAcronym: e.office.trim().toUpperCase(),
        officeAssignmentAcronym: e.officeAssignment.trim().toUpperCase(),
        employmentStatus: e.employmentStatus as EmploymentStatus,
      },
    });
    console.log(`Created user with id: ${regular.id}`);
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
