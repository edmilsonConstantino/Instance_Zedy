import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BarcodeScannerProps {
  onScan: (code: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerId = 'barcode-scanner-container';

  useEffect(() => {
    const scanner = new Html5Qrcode(containerId);
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 150 } },
      (decodedText) => {
        scanner.stop().catch(() => {});
        onScan(decodedText);
      },
      () => {}
    ).catch(() => {
      setError('Não foi possível aceder à câmara. Verifique as permissões.');
    });

    return () => {
      scanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
          <div className="flex items-center gap-2 text-white">
            <Camera className="h-5 w-5" />
            <span className="font-semibold text-sm">Scan Código de Barras</span>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Camera view */}
        {error ? (
          <div className="p-6 text-center space-y-3">
            <p className="text-sm text-red-500">{error}</p>
            <Button variant="outline" onClick={onClose}>Fechar</Button>
          </div>
        ) : (
          <div className="relative">
            <div id={containerId} className="w-full" />
            {/* Guia visual */}
            <p className="text-center text-xs text-gray-500 py-2 px-4">
              Aponte a câmara para o código de barras do produto
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
