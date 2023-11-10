"use client";

import { useState } from "react";
import { type TNewReportSchema } from "@/lib/types";
import ReportForm from "./_components/report-form";
import { useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import ReportTable from "./_components/table";

import { format } from "date-fns";

import * as ExcelJS from "exceljs";

function groupBy<T>(list: T[], keyGetter: (item: T) => string) {
  const map = new Map<string, T[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export default function GenerateReport() {
  const [reportData, setReportData] = useState<TNewReportSchema | null>(null);
  const [show, setShow] = useState(true);

  const searchParams = useSearchParams();

  const { data } = api.event.getReport.useQuery(
    {
      fromDate: new Date(searchParams.get("fromDate")!),
      toDate: new Date(searchParams.get("toDate")!),
    },
    {
      enabled: !!searchParams.get("fromDate") && !!searchParams.get("toDate"),
      refetchOnWindowFocus: false,
    },
  );

  function onSubmitSuccess(formData: TNewReportSchema) {
    setReportData(formData);
    setShow(false);
  }

  async function createExcelFromTemplate({
    motherUnit,
  }: {
    motherUnit?: boolean;
  }) {
    if (data && reportData) {
      const dataByOffice = groupBy(data.employees, (employee) =>
        motherUnit
          ? employee.officeAssignmentAcronym!
          : employee.officeAcronym!,
      );

      // Create a new Excel workbook
      const workbook = new ExcelJS.Workbook();

      // Read the existing Excel file (your template) from the "public" directory
      const templatePath = "flag_report_template.xlsx"; // Use the '/public' prefix
      const templateBuffer = await fetch(templatePath).then((response) =>
        response.arrayBuffer(),
      );

      // Load the template into the workbook
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
      const templateWorksheet = await workbook.xlsx.load(templateBuffer);
      const sheetToClone = templateWorksheet.getWorksheet("Sheet_Template");

      for (const [office, employees] of dataByOffice) {
        const copySheet = workbook.addWorksheet("Sheet");
        copySheet.model = {
          ...(JSON.parse(
            JSON.stringify(sheetToClone!.model),
          ) as ExcelJS.WorksheetModel),
          name: office,
        };

        copySheet.mergeCells("A2:J2");
        const cellA2 = copySheet.getCell("A2");
        cellA2.font = { size: 20, bold: true };
        cellA2.alignment = { horizontal: "center", vertical: "bottom" };
        cellA2.value = reportData.title;

        const cellA3 = copySheet.getCell("A3");
        cellA3.font = { size: 18, bold: true };
        cellA3.alignment = { horizontal: "center", vertical: "middle" };
        cellA3.value = reportData.subtitle;

        const cellA4 = copySheet.getCell("A4");
        cellA4.font = { size: 20, bold: true };
        cellA4.alignment = { horizontal: "center", vertical: "bottom" };
        cellA4.value = office;

        copySheet.mergeCells("A3:J3");
        copySheet.mergeCells("A4:J4");
        copySheet.mergeCells("A6:B6");

        let i = 1;
        const total = data.events.length;
        for (const employee of employees) {
          copySheet.spliceRows(7 + i, 0, [{}]);
          copySheet.getCell(`A${7 + i}`).value = `${i}`;
          copySheet.getCell(`B${7 + i}`).value = employee.fullName;
          copySheet.getCell(`C${7 + i}`).value = `${total ? total : 0}`;
          copySheet.getCell(`H${7 + i}`).value = employee.eventAttendance.length
            ? `${employee.eventAttendance.length}`
            : `${0}`;

          let late = 0;

          for (const attendance of employee.eventAttendance) {
            if (attendance.date > attendance.event.late) {
              late += 1;
            }
          }

          copySheet.getCell(`C${7 + i}`).alignment = {
            horizontal: "center",
            vertical: "middle",
          };
          copySheet.getCell(`H${7 + i}`).alignment = {
            horizontal: "center",
            vertical: "middle",
          };

          if (late !== 0) {
            copySheet.getCell(`I${7 + i}`).value = `${late}`;
          }
          i += 1;
        }

        copySheet.spliceRows(7, 1);
        i -= 1;

        const cellB14 = copySheet.getCell(`B${12 + i}`);
        cellB14.font = { size: 12, bold: true };
        cellB14.alignment = { horizontal: "center", vertical: "middle" };
        cellB14.value = reportData.preparedBy;

        const cellB15 = copySheet.getCell(`B${13 + i}`);
        cellB15.font = { size: 12, italic: true };
        cellB15.alignment = { horizontal: "center", vertical: "bottom" };
        cellB15.value = reportData.position;

        const cellB16 = copySheet.getCell(`B${14 + i}`);
        cellB16.font = { size: 12 };
        cellB16.alignment = { horizontal: "center", vertical: "bottom" };
        cellB16.value = format(new Date(), "MM/dd/yyyy HH:mm");

        const cellE14 = copySheet.getCell(`E${12 + i}`);
        cellE14.font = { size: 12, bold: true };
        cellE14.alignment = { horizontal: "center", vertical: "middle" };
        cellE14.value = reportData.notedBy;

        const cellE15 = copySheet.getCell(`E${13 + i}`);
        cellE15.font = { size: 12, italic: true };
        cellE15.alignment = { horizontal: "center", vertical: "bottom" };
        cellE15.value = reportData.officerPosition;

        copySheet.mergeCells(`E${12 + i}:J${12 + i}`);
        copySheet.mergeCells(`E${13 + i}:J${13 + i}`);
        copySheet.mergeCells(`H${8 + i}:I${8 + i}`);

        copySheet.pageSetup.printArea = `A1:J${19 + i}`;
      }

      templateWorksheet.removeWorksheet("Sheet_Template");

      // Save the modified workbook to a new file
      const excelBlob = await workbook.xlsx.writeBuffer();

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([excelBlob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "output_file.xlsx");
      document.body.appendChild(link);

      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-gray-700">GENERATE REPORT</h1>
      {/* <Button onClick={createExcelFromTemplate}>MAKE REPORT</Button> */}
      {!show && (
        <Button
          className="w-full rounded-sm border-primary bg-white text-xs text-primary hover:bg-white hover:text-primary sm:text-base"
          variant="outline"
          onClick={() => setShow(true)}
        >
          Edit Form Details
        </Button>
      )}
      <div className={show ? "" : "hidden"}>
        <ReportForm onSubmitSuccess={onSubmitSuccess} />
      </div>
      {data && (
        <div>
          <div className="grid grid-cols-2 gap-x-2">
            <Button onClick={() => createExcelFromTemplate({})}>
              Generate By Office
            </Button>
            <Button
              onClick={() => createExcelFromTemplate({ motherUnit: true })}
            >
              Generate By Mother Office
            </Button>
          </div>
          <ReportTable data={data.events} />
        </div>
      )}
    </div>
  );
}
