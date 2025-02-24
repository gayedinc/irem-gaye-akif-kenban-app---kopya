import { useState, useRef, useContext, useEffect } from "react";
import { DownSvg, PlusSvg, SettingSvg, BoardSvg, HideSidebarSvg, EyeSvg } from "../Svg";
import { TaskContext } from "./TaskContext";
import DropdownMenu from "./DropDownMenu";
import DeleteDialog from "./DeleteDialog";
import NewBoard from "./NewBoard";
import EditBoardDialog from "./EditBoardDialog";
import NewColumn from "./NewColumn";
import EmptyPage from "./EmptyPage";
import Detail from "./Detail"; // Detail bileşenini dahil ettik
import NewTask from "./NewTask"; // Yeni görev bileşenini dahil ettik
import { useTheme } from "./ThemeContext"; // Theme context import edildi
import "/style/lightMode.css";
import toast from "react-hot-toast"

export default function Board() {
  const { data, setData, isEdit, setEdit, currentTask, setCurrentTask, activeBoard, setActiveBoard } = useContext(TaskContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false); // Detail Modal durumu
  const [isNewTaskDialogOpen, setIsNewTaskDialogOpen] = useState(false); // New Task Dialog durumu
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false);
  const [isNewBoardDialogOpen, setIsNewBoardDialogOpen] = useState(false);
  const { theme, toggleTheme } = useTheme(); // Tema durumu
  const dropdownRef = useRef(null); // edit delete board dropdown menüsü için

  // Task dropdown menünün menü dışına tıklanınca da kapanması için
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && // dropdown varsa açıldıysa
        !dropdownRef.current.contains(event.target) && // dropdown dışında bir yere tıklandıysa
        !event.target.closest(".task-dropdown") // tıklanan öğenin üst elementlerinden biri task-dropdown değilse
        // yani dropdown içine tıklanmadıysa durumunun kontrolü
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [statuses, setStatuses] = useState([]);
  useEffect(() => {
    // data ve boardsun varlığını kontrol et
    if (data && data.boards) {
      const currentBoard = data.boards.find(board => board.name === activeBoard);
      if (currentBoard) {
        setStatuses(currentBoard.columns.map(column => column.name));
      }
    }
  }, [activeBoard, data]); // data değiştiğinde veya activeBoard değiştiğinde çalışacak


  useEffect(() => {
    // İlk yüklemede yalnızca ilk boardı seç
    if (data && data.boards && data.boards.length > 0 && !activeBoard) {
      const firstBoardName = data.boards[0].name;
      setActiveBoard(firstBoardName);  // İlk boardu seç
    }
  }, [data, activeBoard]);  // activeBoard ilk başta undefined olduğunda çalışsın sonrasında aktif boardu değiştirme


  if (!data) return <div>Loading...</div>;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const boards = data.boards || [];
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const dialogRef = useRef(null);

  const toggleDialog = () => {
    if (!isOpen) {
      dialogRef.current.showModal();
      setIsOpen(true);
    } else {
      dialogRef.current.close();
      setIsOpen(false);
    }
  };

  const handleDialogClick = (e) => {
    if (e.target === dialogRef.current) {
      dialogRef.current.close();
      setIsOpen(false);
    }
  };

  const handleBoardClick = (boardName) => {
    if (boardName !== activeBoard) {  // Eğer board aynı değilse değiştir
      setActiveBoard(boardName);
    }
    setIsOpen(false);  // Dropdownu kapat
  };

  const currentBoard = boards.find((board) => board.name === activeBoard) || { columns: [] };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const onEdit = () => {
    setEdit(true);
  };

  const onDelete = () => {
    setIsDeleteDialogOpen(true);
  };


  const onConfirm = () => {
    const updatedBoards = data.boards.filter((board) => board.name !== activeBoard);
    setData({ ...data, boards: updatedBoards });
    setActiveBoard(updatedBoards.length > 0 ? updatedBoards[0].name : "Platform Launch");
    setIsDeleteDialogOpen(false);
    toast.success("Board deleted successfully!");
  };

  const onCancel = () => {
    setIsDeleteDialogOpen(false);
  };


  // Task detail dialogunu açma fonksiyonu
  const openDetailDialog = (task) => {
    setCurrentTask(task);
    setIsDetailDialogOpen(true);
  };

  // Yeni görev dialogunu açma fonksiyonu
  const openNewTaskDialog = () => {
    setIsNewTaskDialogOpen(true);
  };

  // create new board butonuna basıldığında dialogun kapanması ve new board modalın açılması için
  function handleCreateBoardClick() {
    dialogRef.current.close(); // all boards dialogunu kapat
    setIsNewBoardDialogOpen(true); // new board modalını aç
  }

  const openAddColumnDialog = () => {
    setIsColumnDialogOpen(true);
  }
  const addNewColumnToBoard = (newColumn) => {
    const updatedBoards = data.boards.map((board) => {
      if (board.name === activeBoard) {
        return { ...board, columns: [...board.columns, newColumn] };
      }
      return board;
    });

    setData({ ...data, boards: updatedBoards });
  };

  return (
    <div className={isDarkMode ? "dark-mode" : "light-mode"}>
      <header className="header">
        <div className="header-logo-area">
          <div className="tablet-logo">
            <div className="header-logo">
              <img src="svg/platform-launch-icon.svg" alt="Platform Launch Icon" />
            </div>
            <div className="kanban-logo">
              {isDesktop && (
                theme === "light"
                  ? <img src="svg/dark-kanban.svg" alt="" />
                  : <img src="svg/light-kanban.svg" alt="" />
              )}
            </div>
          </div>
          <div className="active-board-name">
            <h3>{isDesktop && activeBoard}</h3>
          </div>
        </div>

        {!isSidebarOpen && ( // Sidebar kapalıyken butonu göster
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            <span className="open-sidebar"><EyeSvg /></span>
          </button>
        )}

        <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="dropdown">
            <button onClick={toggleDialog} className="dropdown-btn">
              <span>{activeBoard}</span>
              <span className={`dropdown-icon ${isOpen ? "rotated" : ""}`}>
                <DownSvg />
              </span>
            </button>

            <dialog ref={dialogRef} className="dropdown-menu" onClick={handleDialogClick}>
              <p className="menu-title">All Boards ({boards.length})</p>
              <ul>
                {boards.map((board) => (
                  <li key={board.id} className={activeBoard === board.name ? "active" : ""} onClick={() => handleBoardClick(board.name)}>
                    <BoardSvg />
                    {board.name}
                  </li>
                ))}
              </ul>
              <div className="new-board" style={{ color: "#6c5ce7" }}>
                <BoardSvg />
                <span onClick={handleCreateBoardClick}>+ Create New Board</span>
              </div>
              {isDesktop ?
                <>
                  <div className="sidebar-footer">
                    <label className="theme-switch">
                      <img src="/svg/moon-icon-kanban.svg" alt="Moon Icon" />
                      <input
                        className="switch"
                        name="theme-switch"
                        type="checkbox"
                        defaultChecked={theme === "light"}
                        onChange={toggleTheme}
                      />
                      <img src="/svg/sun-icon-kanban.svg" alt="Sun Icon" />
                    </label>
                    <button className="hide-sidebar" onClick={toggleSidebar}>
                      <HideSidebarSvg />
                      <span>Hide Sidebar</span>
                    </button>
                  </div>
                </>
                :
                <>
                  <label className="theme-switch">
                    <img src="/svg/moon-icon-kanban.svg" alt="Moon Icon" />
                    <input
                      className="switch"
                      type="checkbox"
                      defaultChecked={theme === "light"}
                      onChange={toggleTheme}
                    />
                    <img src="/svg/sun-icon-kanban.svg" alt="Sun Icon" />
                  </label>
                </>
              }

            </dialog>
          </div>
        </div>


        <div className="btns-area">
          <button
            className="plus-icon"
            onClick={() => {
              setCurrentTask(null);
              setEdit(false);
              setIsNewTaskDialogOpen(true);
            }}
          >
            <PlusSvg />
            {isDesktop && <span>Add New Task</span>}
          </button>

          <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="setting-icon" ref={dropdownRef}>
            <SettingSvg />
          </div>

          {isDropdownOpen && (
            <div className="task-dropdown">
              <button className="task-dropdown-item" onClick={() => setIsEditDialogOpen(true)}>
                Edit Board
              </button>
              <button className="task-dropdown-item delete" onClick={onDelete}>
                Delete Board
              </button>
            </div>
          )}

          {isDeleteDialogOpen && (
            <div className="dialog-overlay">
              <div className="delete-dialog">
                <h3>Delete this board?</h3>
                <p>Are you sure you want to delete the board? This action cannot be undone.</p>
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
          )}
        </div>
      </header>

      {isEditDialogOpen && (
        <div className="new-board-modal-overlay" onClick={() => setIsEditDialogOpen(false)}>
          <div className="new-board-modal" onClick={(e) => e.stopPropagation()}>
            <EditBoardDialog
              isOpen={isEditDialogOpen}
              onClose={() => setIsEditDialogOpen(false)}
              activeBoard={activeBoard}
              setActiveBoard={setActiveBoard}
              data={data}
              setData={setData}
            />
          </div>
        </div>
      )}

      <div className={`board-content ${isSidebarOpen ? "with-sidebar" : ""}`}>
        {currentBoard && currentBoard.columns && currentBoard.columns.length > 0 ? (
          <>
            <div key={currentBoard.id} className="board-columns">
              {currentBoard.columns.map((column) => (
                <div key={column.id} className="board-column">

                  <h3 className="sda"><span className="asd"></span>{column.name}({column.tasks.length})</h3>
                  <div className="tasks" style={column.tasks.length === 0 ? { outline: "1px dashed #828fa3", outlineWidth: 2, borderRadius: 6 } : {}}>
                    {column.tasks.map((task) => {
                      const activetasks = task.subtasks.filter((x) => x.isCompleted).length;
                      return (
                        <div key={task.id} className="task-card" onClick={() => openDetailDialog(task)}>
                          <h4>{task.title}</h4>
                          <h6>
                            {activetasks} of {task.subtasks.length} subtasks
                          </h6>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
              <button onClick={openAddColumnDialog} className="new-column">+New Column</button>
            </div>
          </>
        ) : (
          <div className="empty-board-message"><EmptyPage /></div>
        )}
      </div>

      {isNewTaskDialogOpen && (
        <div className="new-task-modal-overlay" onClick={() => setIsNewTaskDialogOpen(false)}>
          <div className="new-task-modal" onClick={(e) => e.stopPropagation()}>
            <NewTask onClose={() => setIsNewTaskDialogOpen(false)} />
          </div>
        </div>
      )}

      {isDetailDialogOpen && (
        <div className="detail-modal-overlay" onClick={() => setIsDetailDialogOpen(false)}>
          <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
            <Detail onClose={() => setIsDetailDialogOpen(false)} openNewTaskDialog={openNewTaskDialog} setIsDetailDialogOpen={setIsDetailDialogOpen} />
          </div>
        </div>
      )}

      {isColumnDialogOpen && (
        <div className="new-task-modal-overlay" onClick={() => setIsColumnDialogOpen(false)}>
          <div className="new-task-modal" onClick={(e) => e.stopPropagation()}>
            <NewColumn onClose={() => setIsColumnDialogOpen(false)} addNewColumnToBoard={addNewColumnToBoard} />
          </div>
        </div>
      )}
      {isNewBoardDialogOpen && (
        <div className="new-board-modal-overlay" onClick={() => setIsNewBoardDialogOpen(false)}>
          <div className="new-board-modal" onClick={(e) => e.stopPropagation()}>
            <NewBoard onClose={() => setIsNewBoardDialogOpen(false)} isNewBoardDialogOpen={isNewBoardDialogOpen} setIsNewBoardDialogOpen={setIsNewBoardDialogOpen} />
          </div>
        </div>
      )}
    </div>
  );
}
