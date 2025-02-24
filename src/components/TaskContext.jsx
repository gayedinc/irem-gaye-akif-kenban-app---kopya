import { createContext, useState, useEffect } from "react";

export const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [data, setData] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [activeBoard, setActiveBoard] = useState(() => {
    return data?.boards?.length > 0 ? data.boards[0].name : "";
  });


  // sayfa yüklendiğinde localStorageı kontrol et yoksa data.jsondan al
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.taskData || "null");
    if (storedTasks?.boards?.length > 0) {
      setData(storedTasks);
    } else {
      async function getData() {
        const response = await fetch("data/data.json");
        const fetchedData = await response.json();
        setData(fetchedData);
        localStorage.taskData = JSON.stringify(fetchedData);
      }
      getData();
    }
  }, []);

  // data değiştiğinde localstorageı güncelle
  useEffect(() => {
    if (data?.boards?.length > 0) {
      localStorage.taskData = JSON.stringify(data);
    }
  }, [data]);


  return (
    <TaskContext.Provider
      value={{ data, setData, isEdit, setEdit, currentTask, setCurrentTask, activeBoard, setActiveBoard }}
    >
      {children}
    </TaskContext.Provider>
  );
}