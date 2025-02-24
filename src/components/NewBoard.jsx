import { useState, useContext } from "react";
import "/style/new-board.css";
import { TaskContext } from "./TaskContext";
import toast from "react-hot-toast"

export default function NewBoard({ onClose, isNewBoardDialogOpen, setIsNewBoardDialogOpen }) {
  const { data, setData, isEdit, setEdit, currentTask, setCurrentTask, activeBoard, setActiveBoard } = useContext(TaskContext);
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState([]);

  // Dialog içindeki input alanı ekle
  function addColumn() {
    setColumns(prevColumns => [...prevColumns, ""]);
    console.log(columns)
  }

  function handleAddColumn(i, value) {
    setColumns(prevColumns => {
      const newColumns = [...prevColumns];
      newColumns[i] = value;
      return newColumns;
    });
  }

  // Dialog içindeki input alanını silme
  function removeColumn(index) {
    const newColumns = columns.filter((column, i) => i !== index);
    setColumns(newColumns);
  };

  function createBoard() {
    const validColumns = columns
      .map(name => name.trim())
      .filter(name => name !== "");

    if (!boardName.trim() || validColumns.length === 0) {
      toast.error("Board name and at least one valid column are required!");
      return;
    }

    const newBoard = {
      id: crypto.randomUUID(),
      name: boardName,
      columns: validColumns.map(name => ({
        id: crypto.randomUUID(), // Benzersiz ID
        name,
        tasks: [],
      })),
    };

    setData({ ...data, boards: [...data.boards, newBoard] });
    setActiveBoard(boardName);
    setIsNewBoardDialogOpen(false);
    toast.success("Board added successfully!");
  }



  return (
    <>
      <div className="new-board-container">
        <h2>Add New Board</h2>
        <form autoComplete="off">
          <div className="board-name-area">
            <label htmlFor="name">Board Name</label>
            <div>
              <input type="text" name="boardname" placeholder="e.g. Web Design" value={boardName} onChange={(e) => setBoardName(e.target.value)} required />
            </div>
          </div>
          <div className="column-area">
            <label htmlFor="columns">Board Columns</label>
            {columns.map((column, index) => (
              <div className="flex" key={index}>
                <input type="text" name="boardcolumns" value={column} onChange={(e) => handleAddColumn(index, e.target.value)} required />
                <img onClick={() => removeColumn(index)} src="/assets/images/cancel-icon.svg" />
              </div>
            ))}
          </div>
          <div className="button-area">
            <button className="addnewcolumn" type="button" onClick={addColumn}>+ Add New Column</button>
            <button className="createnewboard" type="button" onClick={createBoard}>Create New Board</button>
          </div>
        </form>
      </div>
    </>
  )
}