# Task Manager - CRUD App with Authentication

A complete **React.js** task management application with full CRUD operations (Create, Read, Update, Delete), filtering, search, and **JWT-simulated session-based authentication**.

## 📋 Features

### 🔐 **Authentication & Session Management**
- **Session-based login** with email/password
- **JWT-simulated token** generation and validation
- User data stored in **sessionStorage** (persists during browser session only)
- Session persists across page refreshes in same tab
- **Automatic logout** when tab closes or session expires
- **24-hour session expiration** with real-time countdown
- Unique **session IDs** for each login
- **Session information display** with login/expiry times
- **Automatic session validation** every 30 seconds
- **Automatic redirect** to login if session expires
- **Logout functionality** to end session immediately
- **Demo account** for quick testing (demo@example.com / demo123)
- Password validation (minimum 6 characters)
- Email format validation
- Show/hide password toggle

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

## 🔍 **Advanced Search - Elasticsearch Style**
- **Elasticsearch-style workflow**: Input → Debounce → Filter → Rank → Render
- **Multiple matching algorithms**:
  - Substring: Search term appears anywhere in text
  - Fuzzy: Typo-tolerant matching with scoring
  - Word: Whole word matching only
  - Prefix: Text starts with search term
  - Exact: Full text equality
- **Case-insensitive search** across all fields
- **Multi-field search** across title and description
- **Multi-token search** (all tokens must match - AND logic)
- **Result ranking** by relevance score
- **Auto-suggestions** based on current input
- **Search history** (last 10 searches)
- **Performance metrics** display
  - Result count
  - Search execution time
  - Number of terms used
- **Toggle between Basic and Advanced search modes**

### 🎯 **Filtering Options**
1. **All** - Shows all tasks
2. **Completed** - Shows only completed tasks ✅
3. **Pending** - Shows only pending tasks ⏳
4. **High Priority** - Shows only high priority tasks 🔴
5. **Medium Priority** - Shows only medium priority tasks 🟠
6. **Low Priority** - Shows only low priority tasks 🟢

### ✅ Additional Features
- **Toggle Complete/Pending** status with checkbox
- **localStorage persistence** - tasks saved automatically
- **sessionStorage** - user login persists during browser session only
- **Responsive design** - works on desktop, tablet, and mobile
- **Emoji indicators** for better UX
- **Smooth animations** and transitions
- **Empty state message** when no tasks exist
- **User profile display** with logout option
- **Filter badges** showing task counts
- **Session info button** for viewing session details
- **Auto-logout on expiry** with optional warning

### ✉️ **Task Mail Automation (Simulated Cron)**
- **Automatic task monitoring** every 20 minutes
- **Mock email notifications** for:
  - ⚠️ Overdue tasks (past due date)
  - 📌 Due soon tasks (within 24 hours)
  - 🔴 High priority reminders (pending high-priority items)
  - 📊 Daily summaries (overall task stats)
- **Email notifications panel** in dashboard
- **Manual trigger** button for testing
- **Email logging** to localStorage (last 100 emails)
- **Real-time status display** (Active/Inactive, last check time, email count)
- **Development mode:** 2-minute interval for easier testing
- **Production mode:** 20-minute interval for real usage
- **Email details viewer** - Expand to see full email and task details

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

## 👤 Login Instructions

### First Time Users
1. Use the **demo account** button for quick access:
   - Email: `demo@example.com`
   - Password: `demo123`

### Create Your Own Account
1. Enter any valid email address (format: user@example.com)
2. Enter a password (minimum 6 characters)
3. Click **Login**
4. Your account will be created and stored in sessionStorage

### Important Notes
- Accounts are **session-based** (persists while browser is open)
- Closing the browser will clear the session
- Refreshing the page keeps you logged in
- All tasks are stored in localStorage (persists across sessions)

## 📁 Project Structure

```
c:\Nelo\
├── src/
│   ├── App.jsx                   # Main app with routing logic
│   ├── Dashboard.jsx             # Task dashboard (after login)
│   ├── TaskManager.jsx           # Old component (kept for reference)
│   ├── TaskManager.css           # Dashboard & task styles
│   ├── context/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── components/
│   │   ├── LoginPage.jsx         # Login form component
│   │   ├── ProtectedRoute.jsx    # Route protection component
│   │   ├── TaskForm.jsx          # Form for creating tasks
│   │   ├── TaskList.jsx          # Display all tasks
│   │   ├── FilterBar.jsx         # Filter buttons component
│   │   ├── SearchBox.jsx         # Search input component
│   │   ├── EditModal.jsx         # Modal for editing
│   │   └── DeleteConfirmation.jsx # Delete confirmation dialog
│   ├── styles/
│   │   └── LoginPage.css         # Login page styles
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── index.html                    # HTML template
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # This file
```

## 🎯 Usage Guide

### Login Flow
1. App loads and checks if user is already authenticated
2. If not logged in, shows login page
3. Enter email and password or use demo button
4. After successful login, redirected to task dashboard
5. Logout button visible in top-right corner

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

### Searching Tasks

**Basic Search:**
1. Type in the **search box**
2. Debounce waits 300ms after you stop typing
3. Search filters across task titles and descriptions
4. Results update automatically
5. Click **✕** to clear search

**Advanced Search (Elasticsearch-style):**
1. Toggle **"Advanced Search"** checkbox
2. Type search terms
3. Get suggestions as you type
4. Click suggestions to select them
5. View search statistics (results, time, terms)
6. Previous searches appear in history
7. Switch back to Basic search anytime

**Search Features:**
- **Case-insensitive** - "TASK" finds "task" and "Task"
- **Partial matching** - "mark" finds "Marketing" and "Bookmark"
- **Multi-token search** - "urgent task" finds items with both words
- **Fuzzy matching** - Typo tolerance for misspellings
- **Auto-suggestions** - Suggestions based on matching content
- **Search history** - Quick access to recent searches

### Filtering Tasks
- Click any filter button to view:
  - **All** tasks
  - **Completed** tasks only
  - **Pending** tasks only
  - Tasks by **priority level**
- Task counts update dynamically
- Can combine search with filters

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

### Authentication
- [ ] Login with demo account
- [ ] Login with custom email/password
- [ ] Try invalid email format (should show error)
- [ ] Try password less than 6 characters (should show error)
- [ ] Toggle password visibility
- [ ] Logout and verify redirect to login
- [ ] Refresh page and verify session persists
- [ ] Close browser and reopen (session should clear)

### Task Management
- [ ] Add a task with all fields filled
- [ ] Try adding a task without title (should show error)
- [ ] Clear the form and verify it resets
- [ ] Edit a task and save changes
- [ ] Toggle complete status with checkbox
- [ ] Mark a task as complete and verify visual change
- [ ] Delete a task and confirm dialog appears
- [ ] Cancel delete confirmation
- [ ] Add a task with past due date and verify "Overdue" badge
- [ ] Refresh browser and verify tasks persist

### Search & Filtering
- [ ] Search by task title
- [ ] Search by task description
- [ ] Verify search is case-insensitive
- [ ] Clear search and verify all tasks show
- [ ] Filter by "Completed" tasks
- [ ] Filter by "Pending" tasks
- [ ] Filter by "High Priority"
- [ ] Filter by "Medium Priority"
- [ ] Filter by "Low Priority"
- [ ] Verify filter counts are accurate
- [ ] Combine search with filters

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] Verify forms are usable on all devices
- [ ] Verify buttons are accessible on mobile

## 🤝 Technologies Used

- **React 18** - UI library with hooks
- **Context API** - State management and authentication
- **Vite** - Build tool & dev server
- **localStorage API** - Task persistence
- **sessionStorage API** - Session-based authentication
- **CSS3** - Styling with variables and animations
- **ES6+** - Modern JavaScript

## 🔐 Security Notes

- **Session Storage**: User data is stored in browser's sessionStorage
  - Data is cleared when browser tab closes
  - Data is NOT sent to any server
  - Use for demo/development purposes only

- **Production Considerations**:
  - Implement proper backend authentication
  - Use JWT tokens with httpOnly cookies
  - Add password hashing
  - Implement refresh tokens
  - Add HTTPS enforcement
  - Add CORS protection

## 📝 Notes

- Tasks are stored in browser's localStorage
- User sessions are stored in sessionStorage
- No backend server required for demo
- Each browser/device has its own task storage
- Each session has its own user context
- Export/import functionality can be added as an enhancement

## 🐛 Troubleshooting

### Can't login
- Check if email format is valid (user@example.com)
- Check if password is at least 6 characters
- Try using demo account

### Tasks not persisting
- Check if localStorage is enabled in browser
- Clear browser cache and reload

### Can't see logout button
- Make sure you're logged in
- Check if browser window is wide enough

### Styles not loading
- Ensure CSS files are in correct location
- Rebuild with `npm run build`

### Dev server won't start
- Delete `node_modules` folder
- Run `npm install` again
- Try `npm run dev`

### Session cleared after refresh
- This is expected behavior for sessionStorage
- If tasks should persist, they are stored in localStorage
- Login again to restore user session

---

**Happy task managing!** 📝✨
