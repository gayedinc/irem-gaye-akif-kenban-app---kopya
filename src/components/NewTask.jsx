import { useState, useContext } from "react";
import { DownSvg } from "../Svg";
import { TaskContext } from "./TaskContext";
import toast from "react-hot-toast"

export default function NewTask({ onClose }) {
  const { data, setData, isEdit, setEdit, currentTask, setCurrentTask, activeBoard } = useContext(TaskContext);

  // Eğer activeBoard tanımlı değilse veri içindeki ilk boardun adını kullanıyoruz.
  const effectiveActiveBoard =
    activeBoard ||
    (data && data.boards && data.boards.length > 0 ? data.boards[0].name : "");

  const currentBoard = data.boards.find(board => board.name === effectiveActiveBoard) || { columns: [] };
  const statuses = currentBoard.columns.map((column) => column.name); // Dinamik status listesi

  const [columns, setColumns] = useState(
    currentTask ? currentTask.subtasks.map((st) => st.title) : []
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(
    currentTask ? currentTask.status : statuses[0] // İlk statusü varsayılan yap
  );

  const handleSelect = (status) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };

  function addColumn(e) {
    e.preventDefault();
    setColumns([...columns, ""]);
  }

  function handleAddColumn(i, value) {
    const newColumns = [...columns];
    newColumns[i] = value;
    setColumns(newColumns);
  }

  const removeColumn = (index) => {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  };

  // Yeni görev ekleme fonksiyonu
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    if (currentBoard.columns.length === 0) {
      return toast.error("You need to create a column first.");
    }

    formObj.id = crypto.randomUUID(); // Yeni görev için benzersiz bir id
    formObj.subtasks = columns.map((title) => ({ title, isCompleted: false }));
    formObj.status = selectedStatus;

    setData((prevData) => {
      const newData =
        prevData && prevData.boards ? { ...prevData } : { boards: [] };

      newData.boards = newData.boards.map((board) => {
        if (board.name !== effectiveActiveBoard) return board;
        return {
          ...board,
          columns: board.columns.map((col) => {
            if (col.name !== selectedStatus) return col;
            return {
              ...col,
              tasks: [...(col.tasks || []), formObj],
            };
          }),
        };
      });

      localStorage.taskData = JSON.stringify(newData);
      return newData;
    });

    // Formu sıfırlama işlemleri
    setColumns([]);
    setSelectedStatus("Todo");
    setCurrentTask(null);
    toast.success("Task added successfully!");
    onClose(); // Modalı kapat
  }

  // Görev güncelleme fonksiyonu
  const updatedTasks = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    // newTaskData: güncellenmiş görev nesnesi
    const newTaskData = {
      ...currentTask,
      title: formObj.title || currentTask.title,
      description: formObj.description || currentTask.description,
      subtasks:
        columns.length > 0
          ? columns.map((title) => ({ title, isCompleted: false }))
          : currentTask.subtasks,
      status: selectedStatus || currentTask.status,
    };

    setData((prevData) => {
      if (!prevData || !prevData.boards) return prevData;
      const newData = { ...prevData };

      for (let board of newData.boards) {
        if (board.name !== effectiveActiveBoard) continue;
        for (let col of board.columns) {
          const taskIndex = col.tasks.findIndex(
            (task) => task.id === currentTask.id
          );
          if (taskIndex !== -1) {
            // Eski görevi çıkarıyoruz
            col.tasks.splice(taskIndex, 1);
            // Yeni statüye uygun columnu buluyoruz
            const targetColumn = board.columns.find(
              (c) => c.name === selectedStatus
            );
            if (targetColumn) {
              targetColumn.tasks.push(newTaskData);
            }
            break;
          }
        }
      }

      localStorage.taskData = JSON.stringify(newData);
      toast.success("Task updated successfully!");
      return newData;
    });

    setEdit(false);
    setCurrentTask(null);
    e.target.reset();
    // Modalı kapatma işlemi
    onClose();
  };

  return (
    <form autoComplete="off" onSubmit={(e) => (isEdit ? updatedTasks(e) : handleSubmit(e))}>
      <div className="new-task-dialog-container">
        <h1>{isEdit ? "Edit Task" : "Add New Task"}</h1>
        <div className="newtask-title-section">
          <h4>Title</h4>
          <input
            type="text"
            defaultValue={currentTask ? currentTask.title : ""}
            name="title"
            placeholder="e.g. Take coffee break"
          />
        </div>
        <div className="newtask-description-section">
          <h4>Description</h4>
          <textarea
            name="description"
            defaultValue={currentTask ? currentTask.description : ""}
            placeholder="e.g. It’s always good to take a break."
          ></textarea>
        </div>
        <div className="newtask-subtasks-section">
          <h4>Subtasks</h4>
          {columns.map((column, index) => (
            <div className="flex" key={index}>
              <input
                placeholder="e.g. Web Design"
                type="text"
                name="subtask"
                value={column}
                onChange={(e) => handleAddColumn(index, e.target.value)}
              />
              <img
                onClick={() => removeColumn(index)}
                src="/assets/images/cancel-icon.svg"
                alt="remove"
              />
            </div>
          ))}
          <button onClick={addColumn} className="addnew-subtask-btn">
            + Add New Subtask
          </button>
        </div>
        <div className="newtask-status-section">
          <h4>Status</h4>
          <div className="dropdown">
            <div className="dropdown-selected" onClick={() => setIsOpen(!isOpen)}>
              {selectedStatus}
              <span className={`dropdown-icon ${isOpen ? "rotated" : ""}`}>
                <DownSvg />
              </span>
            </div>
            {isOpen && (
              <div className="dropdown-menu">
                {statuses.map((status) => (
                  <div
                    key={status}
                    className="dropdown-item"
                    onClick={() => handleSelect(status)}
                  >
                    {status}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <button className="create-task-btn">
          {isEdit ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
}
