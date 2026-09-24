import React from 'react';

interface RpiLogoProps {
  className?: string;
  size?: number | string;
  showText?: boolean;
}

export const RpiLogo: React.FC<RpiLogoProps> = ({
  className = 'w-12 h-12',
  size,
  showText = false,
}) => {
  const sizeStyle = size ? { width: size, height: size } : undefined;

  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`} style={sizeStyle}>
      <img
        src="/images/logo-yayasan-rpi.svg"
        alt="Logo Yayasan Rumah Pendidikan Islam - MI RPI Jakarta"
        className="w-full h-full object-contain filter drop-shadow-xs"
        loading="eager"
      />
    </div>
  );
};
