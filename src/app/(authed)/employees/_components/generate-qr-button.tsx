"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import QRCode from "react-qr-code";

import { type Employee } from "./columns";
import JSZip from "jszip";
import { toPng } from "html-to-image";

import { useRef, useState } from "react";

export default function GenerateQrButton({
  employees,
  indexes,
  all,
}: {
  employees: Employee[];
  indexes: string[];
  all?: boolean;
}) {
  const [current, setCurrent] = useState<{
    id: string;
    office: string;
    fullName: string;
  }>({
    fullName: employees[0]!.fullName,
    office: employees[0]!.officeAcronym!,
    id: employees[0]!.id,
  });

  const imageRef = useRef<HTMLDivElement | null>(null);

  async function generateQr() {
    const selectedItems: { id: string; office: string; fullName: string }[] =
      [];

    if (all) {
      for (const employee of employees) {
        selectedItems.push({
          fullName: employee.fullName,
          office: employee.officeAssignmentAcronym!,
          id: employee.id,
        });
      }
    } else {
      for (const index of indexes) {
        const employee = employees[Number(index)];

        if (employee) {
          selectedItems.push({
            fullName: employee.fullName,
            office: employee.officeAssignmentAcronym!,
            id: employee.id,
          });
        }
      }
    }

    const zip = new JSZip();

    for (const item of selectedItems) {
      setCurrent((prev) => ({
        ...prev,
        fullName: item.fullName,
        office: item.office,
        id: item.id,
      }));

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve("");
        }, 50);
      });

      const url = await toPng(imageRef.current!, { cacheBust: false });

      const binaryData = atob(url.split(",")[1]!);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      // Add the binary data to the zip file
      zip.file(`${item.office} - ${item.fullName}.png`, uint8Array);
    }

    // Generate the zip file and provide a download link
    zip
      .generateAsync({ type: "blob" })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement("a");
        downloadLink.href = url;
        downloadLink.download = "qrcodes.zip";
        downloadLink.click();
      })
      .catch((err) => console.log(err));
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>{all ? "Generate All" : "Generate QR"}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>Start generating QR</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center">
          <div
            ref={imageRef}
            id="qr-to-image"
            className="flex max-w-[130px] flex-col items-center justify-center gap-y-1 rounded-sm border-2 border-gray-700 bg-white p-1"
          >
            <div className="text-center text-xs font-bold">
              {current.office}
            </div>
            <QRCode size={120} value={current.id} className="h-auto w-auto" />
            <div className="text-center text-[10px] font-bold">
              {current.fullName}
            </div>
          </div>
        </div>
        <Button className="w-full" onClick={generateQr}>
          Start
        </Button>
      </DialogContent>
    </Dialog>
  );
}
