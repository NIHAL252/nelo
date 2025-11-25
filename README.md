# Task Manager - CRUD App

A complete **React.js** task management application with full CRUD operations (Create, Read, Update, Delete).

## 📋 Features

### ✅ Create Tasks
- Add tasks with **Title**, **Description**, **Priority** (Low/Medium/High), and **Due Date**
- **Field validation** (Title, Priority, Due Date are required)
- **Clear form button** to reset all fields after submission
- Real-time error messages for invalid inputs

### ✅ Read/Display Tasks
- Display all tasks with:
  - Task title and description
  - **Priority badges** (color-coded: Red=High, Orange=Medium, Green=Low)
  - **Due date** in readable format
  - **Status badge** (Done/Pending)
  - **Overdue indicator** for past-due dates

### ✅ Update Tasks
- **Edit modal** for updating task details
- Inline editing with form validation
- Save changes to localStorage automatically

### ✅ Delete Tasks
- **Delete confirmation dialog** to prevent accidental deletion
- Shows task title in confirmation
- Permanently removes task from list

### ✅ Additional Features
- **Toggle Complete/Pending** status with checkbox
- **localStorage persistence** - tasks saved automatically
- **Responsive design** - works on desktop, tablet, and mobile
- **Emoji indicators** for better UX
- **Smooth animations** and transitions
- **Empty state message** when no tasks exist

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation Steps

1. **Clone or navigate to the project directory:**
   ```bash
   cd c:\Nelo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   - The app will typically run at `http://localhost:5173`
   - Copy the URL from terminal output and paste in your browser

## 📁 Project Structure

```
c:\Nelo\
├── src/
│   ├── TaskManager.jsx           # Main component
│   ├── TaskManager.css           # Styles
│   ├── components/
│   │   ├── TaskForm.jsx          # Form for creating tasks
│   │   ├── TaskList.jsx          # Display all tasks
│   │   ├── EditModal.jsx         # Modal for editing
│   │   └── DeleteConfirmation.jsx # Delete confirmation dialog
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🎯 Usage Guide

### Adding a Task
1. Fill in the **Add New Task** form:
   - Enter a task **title** (required)
   - Add a **description** (optional)
   - Select a **priority** level (required)
   - Choose a **due date** (required)
2. Click **"Add Task"** button
3. Task appears at top of the list
4. Form clears automatically

### Editing a Task
1. Click the **✏️ Edit** button on any task
2. Modify task details in the modal
3. Click **"Save Changes"** to update
4. Changes save to localStorage automatically

### Marking Tasks Complete
1. Click the **checkbox** next to the task
2. Task shows completed visual state
3. Status updates instantly

### Deleting a Task
1. Click the **🗑️ Delete** button
2. Confirm deletion in the popup dialog
3. Task is permanently removed

### Form Validation
- Required fields show **error messages** if empty
- **Red input borders** indicate validation errors
- Fix errors to submit successfully

## 💾 Data Persistence

- All tasks are **automatically saved to localStorage**
- Tasks persist between browser sessions
- Data is stored locally in your browser (no server required)

## 🎨 Styling Highlights

- **Color-coded priority badges**:
  - 🔴 High (Red)
  - 🟠 Medium (Orange)
  - 🟢 Low (Green)
- **Responsive grid layout** adapts to screen size
- **Dark/Light text contrast** for readability
- **Hover effects** on interactive elements
- **Smooth modal animations**
- **Overdue task highlighting**

## 📱 Responsive Design

- **Desktop**: 2-column layout (form + tasks)
- **Tablet**: Optimized grid layout
- **Mobile**: Single column, optimized buttons and spacing

## 🚀 Build & Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to hosting (e.g., Vercel, Netlify)
```bash
# Build the project
npm run build

# Upload the 'dist' folder to your hosting service
```

## 🧪 Testing Checklist

- [ ] Add a task with all fields filled
- [ ] Try adding a task without title (should show error)
- [ ] Clear the form and verify it resets
- [ ] Edit a task and save changes
- [ ] Toggle complete status with checkbox
- [ ] Mark a task as complete and verify visual change
- [ ] Delete a task and confirm dialog appears
- [ ] Cancel delete confirmation
- [ ] Refresh browser and verify tasks persist
- [ ] Add a task with past due date and verify "Overdue" badge
- [ ] Test on mobile/tablet view

## 🤝 Technologies Used

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **localStorage API** - Data persistence
- **CSS3** - Styling with variables and animations
- **ES6+** - Modern JavaScript

## 📝 Notes

- Tasks are stored in browser's localStorage
- No backend server required
- Clear browser data to reset all tasks
- Each browser/device has its own task storage
- Export/import functionality can be added as an enhancement

## 🐛 Troubleshooting

### Tasks not persisting
- Check if localStorage is enabled in browser
- Clear browser cache and reload

### Styles not loading
- Ensure CSS file is in correct location
- Rebuild with `npm run build`

### Dev server won't start
- Delete `node_modules` folder
- Run `npm install` again
- Try `npm run dev`

---

**Happy task managing!** 📝✨
