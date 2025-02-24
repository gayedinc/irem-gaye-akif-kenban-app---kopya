import { useState } from "react";
import { SettingSvg } from "../Svg";

export default function DropdownMenu({ onEdit, onDelete }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <div className="dropdown-wrapper relative">
      <button onClick={handleToggle} className="setting-icon">
        <SettingSvg />
      </button>

      {isOpen && (
        <div className="task-dropdown">
          <button className="task-dropdown-item" onClick={onEdit}>
            Edit Task
          </button>
          <button className="task-dropdown-item delete" onClick={onDelete}>
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
}
