export default function DeleteDialog({ onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="delete-dialog">
        <h3>Delete this task?</h3>
        <p>Are you sure you want to delete the task? This action cannot be undone.</p>
        <div className="delete-dialog-actions">
          <button className="delete-dialog-delete" onClick={onConfirm}>
            Delete
          </button>
          <button className="delete-dialog-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
