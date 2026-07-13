import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  bgColor?: string;
  fgColor?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  value,
  size = 200,
  level = 'H',
  includeMargin = true,
  bgColor = '#ffffff',
  fgColor = '#000000'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && value) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: includeMargin ? 4 : 0,
        color: {
          dark: fgColor,
          light: bgColor
        },
        errorCorrectionLevel: level
      }, (error) => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [value, size, level, includeMargin, bgColor, fgColor]);

  return <canvas ref={canvasRef} />;
};

export default QRCodeGenerator;