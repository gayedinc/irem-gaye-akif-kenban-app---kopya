# Kanban Task App

> A user-friendly and mobile-responsive task management application that allows you to organize your tasks using boards and columns, add subtasks for detail, and manage everything with ease.

## Project Overview

Kanban App is a comprehensive task management platform that allows users to manage tasks by organizing them into boards and columns, and even breaking them down further into subtasks.

![image](https://github.com/user-attachments/assets/ebc5cb38-7981-42ce-86ba-17b62c0b3753)

### Core Features

- Users can create unlimited **boards**.

![image](https://github.com/user-attachments/assets/0b36ffa7-af5c-49af-aa32-420af016ca91)

**Create Board Modal**

![image](https://github.com/user-attachments/assets/02750ac0-6409-4da6-999a-386deada065b)

**Edit Board Modal**

![image](https://github.com/user-attachments/assets/d00cf31f-3f63-4afe-a431-4e5b96dad935)

- Each board can have unlimited **columns**.

![image](https://github.com/user-attachments/assets/8fcacdaf-e268-4b30-a538-e6c631791d10)

**Create and Edit Column Modal**

![image](https://github.com/user-attachments/assets/e0a4ea86-634a-4e27-a2c7-a1ad3fee8308)

- Each column can contain multiple **tasks**.

**Create Task Modal**

![image](https://github.com/user-attachments/assets/08aef557-758a-4a3c-a026-278dfcd14e07)

- Clicking a task opens the task detail modal, where you can edit, delete, or move the task to another column.

![image](https://github.com/user-attachments/assets/4392bf52-5f09-4faa-99c2-c8e2cd2ddf39)

- Each task can contain multiple **subtasks**.

![image](https://github.com/user-attachments/assets/56911ba6-3148-4a87-bc7d-91c913a6dcf6)

- All items are **editable** and **deletable**.

**Edit Task Modal**

![image](https://github.com/user-attachments/assets/3d321499-1456-4569-83f4-4bb1a498125c)

**Delete Task Modal**

![image](https://github.com/user-attachments/assets/68504011-cc14-4ca1-948a-d734f08fb553)

- Includes **dark/light theme toggle** support.

![image](https://github.com/user-attachments/assets/9db652c3-a0f3-4471-ba43-2994ab6f2aac)

- Fully **responsive design** for all devices.

![image](https://github.com/user-attachments/assets/459120c6-4ff0-4de6-8feb-a68a436464ed)

- Integrated **toast notifications** for real-time feedback.

![image](https://github.com/user-attachments/assets/91d697cc-d323-4757-bf9b-393c87a1842b)

## Team Contributions

### Gaye Dinç

- Built the global **Context API** setup to distribute all props and logic throughout the app.
- Integrated the full **data set** into the project.
- Designed and implemented **mobile and tablet header layouts**.
- Fully implemented the **Add Task** and **Edit Task** functionalities.
- Created and styled all **modals** except for delete confirmation modals (e.g., Add/Edit Task, Column, Board).
- Handled **task placement logic** according to their status and board.
- Developed the app's **responsive CSS**, ensuring compatibility across screen sizes.
- Made **SVG icons theme-aware**, changing colors dynamically.
- Designed the **empty page** for cases with no boards or columns.
- Added **animations** to improve user experience.
- Used **localStorage** to persist boards, columns, and tasks.
- Integrated the **React Hot Toast** library and implemented feedback messages.
- Managed **form validation** through CSS-based error indicators.

### İrem Çoban

- 

### Mehmet Akif Küçükyılmaz

- 

---

## Usage Flow

1. Create a new **board** and name it.
2. Add **columns** to the board (e.g., "To Do", "In Progress", "Done").
3. Add **tasks** inside each column with details.
4. Optionally, include multiple **subtasks** per task.
5. Move tasks between columns using the **Edit Task modal**.
6. Update or delete tasks as needed.

## Technologies Used

- **React** – Component-based UI library
- **Context API** – Global state management
- **LocalStorage** – Persistent data storage
- **CSS Modules** – Scoped and modular CSS
- **Vercel** – Hosting and deployment
- **React Icons** – Icon library
- **Custom Hooks & Modals** – Reusable UI logic
- **Responsive Design** – Mobile-friendly interface
- **React Hot Toast** – User feedback notifications

## Live Demo

You can view the live application via the following link:

🔗 [https://irem-gaye-akif-kenban-app-hopefully-last.vercel.app](https://irem-gaye-akif-kenban-app-hopefully-last.vercel.app)

## Conclusion

Kanban App offers a seamless and intuitive user experience with powerful task management features. Thanks to the collaborative effort of the development team, it stands as a fully functional and modern productivity tool.

## Installation & Running Locally

To run this project on your local machine, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/kanban-task-app.git
```

If you don’t have Git installed, you can download it from [https://git-scm.com](https://git-scm.com).

### 2. Navigate into the Project Directory

```bash
cd kanban-task-app
```

### 3. Install Dependencies

If you don’t have Node.js and npm (or yarn) installed, download them from [https://nodejs.org](https://nodejs.org).

```bash
npm install
# or
yarn install
```

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
```

The app will typically run at [http://localhost:5173](http://localhost:5173).

### 5. Open in Browser

Open the URL in your browser to start using the application.


## Project File Structure

```bash
 public
 ┣  assets
 ┃ ┗  images               # Contains image assets used in the UI
 ┣  data
 ┃ ┗  data.json            # JSON file storing initial board/task data
 ┗  svg                    # Contains SVG files for icons and illustrations

 src
 ┣  components
 ┃ ┣  Board.jsx            # Displays each board with its columns and tasks
 ┃ ┣  DeleteDialog.jsx     # Modal for deleting boards, columns, or tasks
 ┃ ┣  Details.jsx          # Shows detailed task view
 ┃ ┣  DropDownMenu.jsx     # Dropdown menu for board actions
 ┃ ┣  EditBoardDialog.jsx  # Modal to edit board titles and structure
 ┃ ┣  EmptyPage.jsx        # Page shown when no boards or tasks exist
 ┃ ┣  NewBoard.jsx         # Modal for adding new boards
 ┃ ┣  NewColumn.jsx        # Modal for adding new columns
 ┃ ┣  NewTask.jsx          # Modal for creating or editing tasks
 ┃ ┣  TaskContext.jsx      # Global context to manage tasks and data
 ┃ ┗  ThemeContext.jsx     # Context to toggle light/dark themes
 ┣  App.jsx                # Root component containing the app structure
 ┣  App.css                # Global styles
 ┣  Svg.jsx                # All inline SVG icon components
 ┣  helper.jsx             # Utility functions used across components
 ┣  main.jsx               # Application entry point (React DOM render)

 style
 ┣  lightMode.css          # Light theme styles
 ┣  new-board.css          # Styles specific to new board creation modals
 ┗  reset.css              # Resets default browser styling

 .gitattributes            # Git text handling configuration
 .gitignore                # Specifies files to ignore in Git
 README.md                 # Project documentation
 asd.txt                   # (Temporary or unused file)
 eslint.config.js          # ESLint configuration
 index.html                # Main HTML file
 package-lock.json         # Locked versions of installed dependencies
 package.json              # Project metadata and dependencies
