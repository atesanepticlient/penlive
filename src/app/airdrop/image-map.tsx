import { ReactNode } from "react";

type ImageMapProps = {
  children: ReactNode;
  onClick?: () => void;
  x: string; // e.g. "25%"
  y: string; // e.g. "78%"
  width?: string; // default "50%"
  height?: string; // default "10%"
  buttonHide?: boolean;
};

const ImageMap = ({
  children,
  onClick,
  x,
  y,
  width = "50%",
  height = "10%",
  buttonHide = false,
}: ImageMapProps) => {
  return (
    <div className="relative w-full">
      {children}

      {!buttonHide && (
        <svg className="absolute top-0 left-0 w-full h-full">
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx="12"
            fill="transparent"
            onClick={onClick}
            style={{ cursor: "pointer" }}
          />
        </svg>
      )}
    </div>
  );
};

export default ImageMap;
