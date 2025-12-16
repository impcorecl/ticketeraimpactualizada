import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

interface QRScannerProps {
  onScan: (result: string) => void;
  isActive: boolean;
}

export function QRScanner({ onScan, isActive }: QRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const startScanner = async () => {
      try {
        const scanner = new Html5Qrcode("qr-reader");
        scannerRef.current = scanner;

        await scanner.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1,
          },
          (decodedText) => {
            onScan(decodedText);
          },
          () => {
            // Ignore scan failures
          }
        );
      } catch (err) {
        console.error("Error starting scanner:", err);
        setError("No se pudo acceder a la cámara. Verifica los permisos.");
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isActive, onScan]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-secondary/30 rounded-lg">
        <p className="text-destructive text-center px-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div 
        id="qr-reader" 
        className="scanner-container overflow-hidden rounded-xl"
      />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 scanner-overlay" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-primary rounded-lg">
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg" />
          <div className="absolute inset-x-0 top-0 h-0.5 bg-primary/50 animate-scan-line" />
        </div>
      </div>
    </div>
  );
}
