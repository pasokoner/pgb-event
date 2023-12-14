import { useState, useCallback, useEffect, useRef } from "react";

import QrScanner from "qr-scanner";
import { cn } from "@/lib/utils";

type ScannerProps = {
  onScanResult: (data: string) => void;
};

export default function Scanner({ onScanResult }: ScannerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [scannedResult, setScannedResult] = useState("");
  const detectTimeout = useRef<NodeJS.Timeout | null>(null);

  const qrScanner = useCallback(() => {
    return new QrScanner(
      document.getElementById("video-feed") as HTMLVideoElement,
      (result: { data: string }) => {
        setScannedResult((prev) => {
          if (prev === result.data) {
            return prev;
          }

          return result.data;
        });

        if (detectTimeout.current) {
          clearTimeout(detectTimeout.current);
        }

        detectTimeout.current = setTimeout(() => {
          setScannedResult("");
        }, 500);
      },

      {
        /* your options or returnDetailedScanResult: true if you're not specifying any other options */
        highlightScanRegion: true,
        overlay: overlayRef.current ?? undefined,
      },
    );
  }, []);

  useEffect(() => {
    const myScanner = qrScanner();

    myScanner
      .start()
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    return () => {
      myScanner.destroy();
    };
  }, [qrScanner]);

  useEffect(() => {
    onScanResult(scannedResult);
  }, [scannedResult]);

  return (
    <div>
      <video
        id="video-feed"
        style={{
          width: "100%",
          height: "100%",
        }}
      ></video>
      <div ref={overlayRef}>
        <div className="relative h-full w-full">
          <div
            className={cn(
              "absolute right-0 top-0 h-8 w-8 animate-pulse border-r-4 border-t-4 md:h-16 md:w-16",
              !!scannedResult ? "border-green-500" : "",
            )}
          />
          <div
            className={cn(
              "absolute left-0 top-0 h-8 w-8 animate-pulse border-l-4 border-t-4 md:h-16 md:w-16",
              !!scannedResult ? "border-green-500" : "",
            )}
          />
          <div
            className={cn(
              "absolute bottom-0 right-0 h-8 w-8 animate-pulse border-b-4 border-r-4 md:h-16 md:w-16",
              !!scannedResult ? "border-green-500" : "",
            )}
          />
          <div
            className={cn(
              "absolute bottom-0 left-0 h-8 w-8 animate-pulse border-b-4 border-l-4 md:h-16 md:w-16",
              !!scannedResult ? "border-green-500" : "",
            )}
          />
        </div>
      </div>
    </div>
  );
}
