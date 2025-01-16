import React, { useState } from "react";
import ImBringing from "../../pages/ImBringing/ImBringingForm";

interface ToggleButtonProps {
  falseText: string;
  trueText?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  falseText,
  trueText = "Close",
}) => {
  const [showComponent, setShowComponent] = useState(false);

  const handleClick = () => {
    setShowComponent(!showComponent);
  };

  console.log("falseText:", falseText, "Type:", typeof falseText);
  console.log("trueText:", trueText, "Type:", typeof trueText);

  return (
    <div>
      <button onClick={handleClick}>
        {showComponent ? trueText : falseText}
      </button>
      {showComponent && <ImBringing />}
    </div>
  );
};

export default ToggleButton;
