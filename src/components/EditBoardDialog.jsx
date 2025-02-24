import React, { useContext, useEffect, useState } from "react";
import { TaskContext } from "./TaskContext";
import toast from "react-hot-toast"

export default function EditBoardDialog({ isOpen, onClose, activeBoard, setActiveBoard }) {
  const { data, setData } = useContext(TaskContext);
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState([]);
  const [newColumn, setNewColumn] = useState("");

  useEffect(() => {
    if (!data || !data.boards) return;

    const board = data.boards.find((b) => b.name === activeBoard);
    if (board) {
      setBoardName(board.name);
      setColumns(board.columns ? board.columns : []);
    }
  }, [activeBoard, data]);

  const handleSave = () => {
    if (!data || !data.boards) return;

    const updatedBoards = data.boards.map((board) => {
      if (board.name === activeBoard) {
        return {
          ...board,
          name: boardName,
          columns: columns.map((column) => ({
            name: column.name,
            tasks: column.tasks || [],
          })),
        };
      }
      return board;
    });

    setData({ ...data, boards: updatedBoards });
    setActiveBoard(boardName);
    onClose();
    toast.success("Board updated successfully!");
  };

  const addColumn = () => {
    if (newColumn.trim() !== "") {
      setColumns([
        ...columns,
        {
          name: newColumn.trim(),
          tasks: [],
        },
      ]);
      setNewColumn("");
    }
  };

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  const handleEditColumn = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].name = value;
    setColumns(updatedColumns);
  };

  return (
    isOpen && (
      <div className="new-board-container">
        <h2>Edit Board</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="board-name-area">
            <label htmlFor="name">Board Name</label>
            <div>
              <input
                type="text"
                name="name"
                placeholder="e.g. Web Design"
                value={boardName}
                onChange={(e) => setBoardName(e.target.value)}
              />
            </div>
          </div>
          <div className="column-area">
            <label htmlFor="columns">Board Columns</label>
            {columns.map((column, index) => (
              <div className="flex" key={index}>
                <input
                  type="text"
                  name="columns"
                  value={column.name}
                  onChange={(e) => handleEditColumn(index, e.target.value)}
                />
                <img
                  onClick={() => removeColumn(index)}
                  src="/assets/images/cancel-icon.svg"
                  alt="Remove column"
                />
              </div>
            ))}
            <div className="flex">
              <input
                type="text"
                value={newColumn}
                onChange={(e) => setNewColumn(e.target.value)}
                placeholder="Enter new column"
              />
            </div>
          </div>
          <div className="button-area">
            <button className="addnewcolumn-board" type="button" onClick={addColumn}>
              + Add New Column
            </button>
            <button type="submit" className="savechanges-board">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    )
  );
}
