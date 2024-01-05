import { Button } from "@/components/ui/button";
import { groupBy } from "@/lib/utils";
import { type RouterOutputs } from "@/trpc/shared";

import { format } from "date-fns";
import * as ExcelJS from "exceljs";

type AttendeesOutput = RouterOutputs["event"]["attendees"];

type Employees = Omit<AttendeesOutput[number], "date">;

type ExportAttendanceProps = {
  attendees: AttendeesOutput;
  employees: Employees[];
  eventName: string;
  eventDate: Date;
};

export default function ExportAttendance({
  attendees,
  employees,
  eventName,
  eventDate,
}: ExportAttendanceProps) {
  async function exportAttendance() {
    const byOfficeAttendees = groupBy(attendees, (a) => a.officeAcronym!);
    const byOfficeEmployees = groupBy(employees, (e) => e.officeAcronym!);

    const workbook = new ExcelJS.Workbook();

    const attendeesSheet = workbook.addWorksheet("Attendees");
    attendeesSheet.mergeCells("A1:F1");
    attendeesSheet.getCell(`A1`).font = { size: 20, bold: true };
    attendeesSheet.getCell(`A1`).alignment = {
      horizontal: "center",
      vertical: "bottom",
    };
    attendeesSheet.getCell(`A1`).value = "ATTENDANCE";
    attendeesSheet.getCell(`A2`).value = `Event name: ${eventName}`;
    attendeesSheet.getCell(`A3`).value = `Scheduled Data: ${format(
      eventDate,
      "MM/dd/yyyy",
    )}`;

    attendeesSheet.getCell("A4").font = { bold: true };
    attendeesSheet.getCell("B4").font = { bold: true };
    attendeesSheet.getCell("C4").font = { bold: true };
    attendeesSheet.getCell("D4").font = { bold: true };
    attendeesSheet.getCell("E4").font = { bold: true };
    attendeesSheet.getCell("F4").font = { bold: true };

    attendeesSheet.getCell("A4").value = "No.";
    attendeesSheet.getCell("B4").value = "Name";
    attendeesSheet.getCell("C4").value = "Office";
    attendeesSheet.getCell("D4").value = "Office Assignment";
    attendeesSheet.getCell("E4").value = "Status";
    attendeesSheet.getCell("F4").value = "Date and Time Arrived";

    let i = 1;
    for (const [office, attendees] of byOfficeAttendees) {
      console.log(attendees);
      for (const attendee of attendees) {
        attendeesSheet.getCell(`A${4 + i}`).value = `${i}`;
        attendeesSheet.getCell(`B${4 + i}`).value = attendee.fullName;
        attendeesSheet.getCell(`C${4 + i}`).value = attendee.officeAcronym;
        attendeesSheet.getCell(`D${4 + i}`).value =
          attendee.officeAssignmentAcronym;
        attendeesSheet.getCell(`E${4 + i}`).value = attendee.employmentStatus;
        attendeesSheet.getCell(`F${4 + i}`).value = format(
          attendee.date,
          "MM/dd/yyyy HH:mm",
        );
        i += 1;
      }
    }

    const employeesSheet = workbook.addWorksheet("Absentees");
    employeesSheet.mergeCells("A1:E1");
    employeesSheet.getCell(`A1`).font = { size: 20, bold: true };
    employeesSheet.getCell(`A1`).alignment = {
      horizontal: "center",
      vertical: "bottom",
    };
    employeesSheet.getCell(`A1`).value = "ATTENDANCE";
    employeesSheet.getCell(`A2`).value = `Event name: ${eventName}`;
    employeesSheet.getCell(`A3`).value = `Scheduled Data: ${format(
      eventDate,
      "MM/dd/yyyy",
    )}`;

    employeesSheet.getCell("A4").font = { bold: true };
    employeesSheet.getCell("B4").font = { bold: true };
    employeesSheet.getCell("C4").font = { bold: true };
    employeesSheet.getCell("D4").font = { bold: true };
    employeesSheet.getCell("E4").font = { bold: true };

    employeesSheet.getCell("A4").value = "No.";
    employeesSheet.getCell("B4").value = "Name";
    employeesSheet.getCell("C4").value = "Office";
    employeesSheet.getCell("D4").value = "Office Assignment";
    employeesSheet.getCell("E4").value = "Status";

    i = 1;
    for (const [office, employees] of byOfficeEmployees) {
      for (const employee of employees) {
        employeesSheet.getCell(`A${4 + i}`).value = `${i}`;
        employeesSheet.getCell(`B${4 + i}`).value = employee.fullName;
        employeesSheet.getCell(`C${4 + i}`).value = employee.officeAcronym;
        employeesSheet.getCell(`D${4 + i}`).value =
          employee.officeAssignmentAcronym;
        employeesSheet.getCell(`E${4 + i}`).value = employee.employmentStatus;
        i += 1;
      }
    }

    const excelBlob = await workbook.xlsx.writeBuffer();

    // Create a download link
    const url = window.URL.createObjectURL(new Blob([excelBlob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `attendance_record-${eventName}.xlsx`);
    document.body.appendChild(link);

    link.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }

  return <Button onClick={exportAttendance}>Export</Button>;
}
