import React from "react";

const JakpotGameCard = ({
  name,
  image_url,
}: {
  name: string;
  image_url: string;
}) => {
  return (
    <div
      title={name}
      className="p-1.5 rounded-md min-w-28 w-28"
      style={{
        border: `1px solid #5850ec`,
        boxShadow: `
          0 0 0 1px rgba(255,255,255,0.05),
          0 0 5px #5850ec,
          0 15px 4px rgba(0,0,0,0.6)
        `,
      }}
    >
      <img src={image_url} alt={name} className="w-full rounded-md" />
    </div>
  );
};

export default JakpotGameCard;
