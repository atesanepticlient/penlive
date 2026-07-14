import React from "react";

const ActionModal = ({
  header = "Confirmation",
  children,
  onGo,
  onClose,
}: {
  header: string;
  children: React.ReactNode;
  onGo?: () => void;
  onClose?: () => void;
}) => {
  const handleGo = () => {
    onGo();
  };
  const handleClose = () => {
    onClose();
  };
  return (
    <div className="fixed top-0 left-0 right-0 w-full h-screen z-[1000] bg-[#00000040] flex justify-center items-center">
      <div className="bg-white rounded-xl w-[300px]">
        <div className="text-center py-3">
          <span className="text-lg font-medium">{header}</span>
        </div>
        <div className="pb-4 max-w-[70%] mx-auto space-y-2">{children}</div>

        <div className="flex border-t ">
          <button
            onClick={() => handleClose()}
            className="flex-1 border-r text-base py-3"
          >
            Cancel
          </button>
          <button
            className="flex-1 border-r text-base text-blue-600 py-3"
            onClick={() => handleGo()}
          >
            Go
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
