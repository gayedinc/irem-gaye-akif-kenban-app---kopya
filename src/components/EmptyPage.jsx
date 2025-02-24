import { useState } from "react";
import NewColumn from "./NewColumn";

export default function EmptyPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      closeModal(); // overlaye tıklandığında kapanması için
    }
  }

  return (
    <div className="empty-page">
      <h4>This board is empty. Create a new column to get started.</h4>
      <button onClick={openModal} className="add-column-btn">
        + Add New Column
      </button>

      {isModalOpen && (
        <div className="new-task-modal-overlay" onClick={handleOverlayClick}>
          <div className="new-task-modal" onClick={(e) => e.stopPropagation()}>
            <NewColumn onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
