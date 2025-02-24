import { useState, useEffect, useContext, useRef } from "react";
import { TaskContext } from "./TaskContext";
import toast from "react-hot-toast"

export default function NewColumn({ onClose }) {
  const { data, setData, isEdit, setEdit, currentTask, setCurrentTask, activeBoard, setActiveBoard } = useContext(TaskContext);
  const [inputs, setInputs] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState('');
  const [boardData, setBoardData] = useState(null);
  const resetRef = useRef();

  //Yeni column ekleme

  useEffect(() => {
    const activeBoardData = data.boards.find((board) => board.name === activeBoard)
    if (activeBoardData) {
      setSelectedBoardId(activeBoardData.id)
    }
  }, [data.boards, activeBoard]);

  useEffect(() => {
    const board = data.boards.find((x) => x.id === selectedBoardId);
    setBoardData(board || null);
  }, [selectedBoardId, data]);

  useEffect(() => {
    if (boardData?.columns) {
      setInputs(
        boardData.columns.map((column) => ({
          id: column.id,
          name: column.name,
        }))
      );
    }
  }, [boardData]);


  function addNewColumnInput(e) {
    e.preventDefault();
    const newInput = {
      id: crypto.randomUUID(),
      name: "",
    };
    setInputs([...inputs, newInput]);
  }

  function handleColumnSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    console.log("📌 Gelen Form Verisi:", formObj);
    console.log("📌 Orijinal Inputs:", inputs);

    // Kullanıcının doldurduğu inputları kontrol et
    const hasValidInput = inputs.some((input) => {
      const columnName = formObj[`columnName${input.id}`]?.trim();
      return columnName !== "";
    });

    // Eğer hiçbir input geçerli değilse hata ver
    if (!hasValidInput) {
      toast.error("Board name and at least one valid column are required!");
      return;
    }

    // Geçerli columnları filtrele
    const validColumns = inputs
      .map((input) => ({
        id: input.id,
        name: formObj[`columnName${input.id}`]?.trim(),
        tasks: boardData?.columns?.find(x => x.id === input.id)?.tasks || [],
      }))
      .filter(column => column.name !== ""); // Boş olanları çıkar

    // Güncellenmiş board verisini kaydet
    const updatedData = data.boards.map((board) =>
      board.id === selectedBoardId
        ? { ...board, columns: validColumns }
        : board
    );

    setData({ ...data, boards: updatedData });

    resetRef.current.reset();
    if (onClose) onClose();
    toast.success("New column added successfully!");
  }


  // dialog içindeki columnu silme
  function removeColumn(id) {
    setInputs(inputs.filter((input) => input.id !== id));
  }

  return (
    <div className="new-board-container">
      <h2>Add New Column</h2>
      <form ref={resetRef} onSubmit={handleColumnSubmit}>
        <div className="board-name-area">
          <label htmlFor="name">Name</label>
          <input
            disabled
            type="text"
            name="name"
            defaultValue={boardData?.name || ""}
            placeholder="e.g. Web Design"
          />
        </div>
        <div className="column-area">
          <label htmlFor="columns">Columns</label>
          {inputs.map((input) => (
            <div className="flex" key={input.id}>
              <input
                type="text"
                name={`columnName${input.id}`}
                defaultValue={input.name}
              />
              <img
                onClick={() => removeColumn(input.id)}
                src="/assets/images/cancel-icon.svg"
                alt="remove"
              />
            </div>
          ))}
        </div>
        <div className="button-area">
          <button type="button" onClick={addNewColumnInput} className="addnewcolumn-board">
            + Add New Column
          </button>
          <button type="submit" className="savechanges-board">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
