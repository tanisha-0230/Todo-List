import "./App.css";
import { useState, useEffect } from "react";

const Todo = () => {
    // Function to retrieve tasks from localStorage
    function getStoredTasks() {
        let data = localStorage.getItem("task");
        let json = JSON.parse(data);
        return json || []; // Ensure returning an array even if localStorage is empty
    }

    const [task, setTaskName] = useState(""); // State for input task name
    const [taskList, setTaskList] = useState(getStoredTasks()); // State for list of tasks
    const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
    const [currentTaskIndex, setCurrentTaskIndex] = useState(null); // State to track current task index being edited
    const [newTaskName, setNewTaskName] = useState(""); // State for new task name in edit mode
    const [filter, setFilter] = useState("all"); // State for filtering tasks

    // Save tasks to localStorage whenever taskList changes
    useEffect(() => {
        localStorage.setItem("task", JSON.stringify(taskList));
    }, [taskList]);

    // Function to handle adding a new task
    const onAddHandler = () => {
        if (task.trim()) {
            setTaskList([...taskList, { name: task, completed: false }]);
            setTaskName(""); // Clear input after adding task
        } else {
            alert("Task cannot be empty");
        }
    };

    // Function to handle deleting a task
    const onDeleteHandler = (index) => {
        const updatedTaskList = taskList.filter((_, i) => i !== index);
        setTaskList(updatedTaskList);
    };

    // Function to handle initiating task edit
    const onEditHandler = (index) => {
        setIsEditing(true);
        setCurrentTaskIndex(index);
        setNewTaskName(taskList[index].name);
    };

    // Function to handle saving edited task
    const onSaveHandler = () => {
        if (newTaskName.trim()) {
            let updatedTaskList = [...taskList];
            updatedTaskList[currentTaskIndex].name = newTaskName;
            setTaskList(updatedTaskList);
            setIsEditing(false);
            setCurrentTaskIndex(null);
            setNewTaskName("");
        } else {
            alert("Task cannot be empty");
        }
    };

    // Function to handle toggling task completion
    const onToggleCompleteHandler = (index) => {
        let updatedTaskList = [...taskList];
        updatedTaskList[index].completed = !updatedTaskList[index].completed;
        setTaskList(updatedTaskList);
    };

    // Function to handle filter change
    const onFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Function to handle Enter key press in input
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            onAddHandler();
        }
    };

    // Filtered task list based on selected filter
    const filteredTaskList = taskList.filter((item) => {
        if (filter === "completed") {
            return item.completed;
        }
        if (filter === "incomplete") {
            return !item.completed;
        }
        return true;
    });

    return (
        <div className="container text-center">
            <h1 className="my-5">
                <i className="fa-solid fa-list-ul"></i> My To Do List
            </h1>

            <div className="d-flex justify-content-center mb-3">
                <input
                    className="form-control me-2 rounded-pill"
                    type="text"
                    placeholder="Enter your task"
                    value={task}
                    onChange={(e) => setTaskName(e.target.value)}
                    onKeyPress={handleKeyPress} // Handle Enter key press
                />
                <button className="btn rounded-pill" id="btn" onClick={onAddHandler}>
                    Add Task
                </button>
                <select
                    className="form-select rounded-pill w-auto ms-2"
                    id="status-filter"
                    onChange={onFilterChange}
                >
                    <option value="all">All</option>
                    <option value="completed">Completed</option>
                    <option value="incomplete">Incomplete</option>
                </select>
            </div>

            {isEditing && (
                <div className="d-inline-flex mb-3">
                    <input
                        className="form-control me-2 rounded-pill"
                        type="text"
                        placeholder="Edit your task"
                        value={newTaskName}
                        onChange={(e) => setNewTaskName(e.target.value)}
                    />
                    <button className="btn rounded-pill" id="btn" onClick={onSaveHandler}>
                        Save Task
                    </button>
                </div>
            )}

            <ul className="list-unstyled d-flex flex-column align-items-center mt-5">
                {filteredTaskList.map((item, index) => (
                    <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-center my-2 p-1 rounded bg-white text-dark"
                    >
                        <span
                            className="check"
                            onClick={() => onToggleCompleteHandler(index)}
                        >
                            <i
                                className={`fa${
                                    item.completed
                                        ? " fa-solid fa-circle-check"
                                        : " fa-regular fa-circle"
                                }`}
                            ></i>
                        </span>
                        <span
                            className="task-text"
                            style={{
                                textDecoration: item.completed
                                    ? "line-through"
                                    : "none",
                            }}
                        >
                            {item.name}
                        </span>
                        <span>
                            <i
                                className="fa-solid fa-pen-to-square me-2 edit"
                                onClick={() => onEditHandler(index)}
                            ></i>
                            <i
                                className="fa-solid fa-trash delete"
                                onClick={() => onDeleteHandler(index)}
                            ></i>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Todo;
