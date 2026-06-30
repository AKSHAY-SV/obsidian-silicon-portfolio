import React from "react";
import { AnimatePresence } from "motion/react";
import { useCopilot } from "../../hooks/useCopilot";
import CopilotButton from "./CopilotButton";
import CopilotWindow from "./CopilotWindow";

export default function SiliconCopilot() {
  const copilotState = useCopilot();

  return (
    <div id="silicon-copilot-root">
      {/* Floating launcher trigger */}
      <CopilotButton 
        isOpen={copilotState.isOpen} 
        setIsOpen={copilotState.setIsOpen} 
      />

      {/* Floating conversational assistant window */}
      <AnimatePresence>
        {copilotState.isOpen && (
          <CopilotWindow copilotState={copilotState} />
        )}
      </AnimatePresence>
    </div>
  );
}
export { useCopilot };
