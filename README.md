# Campus Event Board - IS113 Project

## Team Members
| Name       | Feature                        |
|------------|--------------------------------|
| Wansim     | Event Management (CRUD)        |
| Yijun      | RSVP System                    |
| Basile     | Comments / Discussion          |
| Angel      | Saved Events / Bookmarks       |
| Victoria   | User Profile Management        |
| Zacchaeus  | Event Reporting / Moderation   |

---

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) v18 or above
- npm (comes with Node.js)

---

## Setup Instructions

1. **Unzip the submitted file**
   Extract the zip file to a folder of your choice.

2. **Navigate to the project folder**

3. **Install dependencies**
```npm install```

4. **Configure environment variables**

Create a `.env` file in the root folder with the following:
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/webdev
SESSION_SECRET=your_secret_key
PORT=8000

---

5. **Start the application**
   ```bash
   nodemon server.js
   ```

6. **Open your browser**
   ```
   http://localhost:8000/index.html   ← Landing page
   http://localhost:8000              ← Main app
   ```


## Test Accounts

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@gmail.com     |   admin    |
| Student | student1@gmail.com  |   1234     |
| Student | student2@gmail.com  |   1234     |

---

## Database Details

- **Platform:** MongoDB Atlas
- **Database name:** `webdev`
- **Collections:** `users`, `events`, `rsvp`, `comments`, `category`, `bookmark`, `report`
- **MongoDB URI:**
- mongodb+srv://<username>:<password>@<cluster>.mongodb.net/webdev


> ⚠️ Ensure your IP address is whitelisted on MongoDB Atlas before running.
---
## Usage

### For Students
1. 📅 Browse upcoming events like hackathons, concerts, and workshops
2. 📝 Create and manage your own events
3. ✅ RSVP and keep track of events you’re attending
4. 🔖 Save events for later
5. 💬 Join discussions and comment on events
6. 🚩 Report issues if needed

### For Admins
1. 👤 User Management
- View all registered user accounts
   - Edit user details, including:
      - Name
      - Password (securely updated with hashing)
      - Role (e.g., student, organizer, admin)
   - Maintain proper role-based access control across the system
2. 🚩 Report Management
   - View all submitted reports from users
   - Update report status (e.g., pending, resolved)
   - Monitor and moderate inappropriate content or issues raised by users
3. 📅 Event Oversight
   - View all events created on the platform
   - Monitor event details to ensure compliance with platform guidelines
4. 🔐 Access Control
   - Admin-only routes are protected using authentication and authorization
   - Only users with the admin role can access these features

### For Developers
- **Models**: Define data structures in the `models/` directory
- **Controllers**: Handle business logic in the `controllers/` directory
- **Routes**: Define API endpoints in the `routes/` directory
- **Views**: Create EJS templates in the `views/` directory

---

## API Endpoints
### Login 
- `GET /user/login` - Show login page
- `POST /user/login` - Login user

### Register
- `GET /user/register` - Show login page
- `POST /user/register` - Login user
- `GET /user/register/admin-code` - Show admin code page
- `POST /user/register/admin-code` - Authenticate admin user

### Student
- `GET /user/home` - Show student home page
- `POST /user/profileedit` - Edit own profile
- `POST /user/profiledelete` - Delete own account

### Admin
- `GET /user/admin` - Show admin home page
- `POST /user/edit-user` - Edit selected profile
- `POST /user/delete-user` - Delete selected account

### Comments
- `POST /comment/create` - Create a new comment
- `GET /comment/event/:eventId` - Get comments for an event
- `POST /comment/update/:id` - Update a comment
- `POST /comment/delete/:id` - Delete a comment
---

## Features & Functionality

### 1. Event Management (Wansim)
- **Create:** Post a new campus event with title, date, location, description, category and image
- **Read:** Browse all events on the event listing page with search, filter and sort; click into individual event details
- **Update:** Edit event details — only accessible by the event organiser; past events cannot be edited
- **Delete:** Remove an event permanently — only accessible by the event organiser; past events cannot be deleted
- **Authorization:** Edit and Delete buttons are only visible to the event organiser who created it
- **Event Status:** Events are automatically labelled as Upcoming / Ongoing / Past based on the current date
  
### 2. RSVP System (Yijun)
- **Create:** RSVP to an event with a status (Going / Maybe / Not Going)
- **Read:** View attendee list for an event; view your personal RSVP history
- **Update:** Change your RSVP status (e.g. Going → Maybe)
- **Delete:** Cancel your RSVP

### 3. Comments / Discussion (Basile)
- **Create:** Post a comment under an event
- **Read:** View all comments displayed under an event page
- **Update:** Edit your own comment after posting
- **Delete:** Remove your own comment

### 4. Saved Events / Bookmarks (Angel)
- **Create:** Bookmark an event to save it for later
- **Read:** View all your saved/bookmarked events in one place
- **Update:** Change bookmark type (e.g. Interested / Priority)
- **Delete:** Remove an event from your saved list

### 5. User Profile Management (Victoria)
- **Create:** Register a new student account
- **Read:** View your own profile details
- **Update:** Edit profile information (name, email, password)
- **Delete:** Deactivate or delete your account

### 6. Event Reporting / Moderation (Zacchaeus)
- **Create:** Submit a report on an inappropriate or incorrect event
- **Read:** Admin views all submitted reports and their statuses
- **Update:** Admin updates report status (Pending → Reviewed → Resolved)
- **Delete:** Admin removes a report after action is taken

---

## Project Structure

```
campus-event-board/
├── app.js
├── .env
├── README.md
├── package.json
│
├── middleware/
│   ├── auth-middleware.js
│   └── upload.js
│
├── routes/
│   ├── eventRoutes.js
│   ├── userRoutes.js
│   ├── rsvpRoutes.js
│   ├── commentRoutes.js
│   ├── bookmarkRoutes.js
│   └── reportRoutes.js
│
├── controllers/
│   ├── eventController.js
│   ├── userController.js
│   ├── rsvpController.js
│   ├── commentController.js
│   ├── bookmarkController.js
│   └── reportController.js
│
├── models/
│   ├── eventModel.js
│   ├── userModel.js
│   ├── rsvpModel.js
│   ├── commentModel.js
│   ├── bookmarkModel.js
│   └── reportModel.js
│
├── views/
│   ├── common/
│   │   └── header.ejs
│   ├── admin.ejs
│   ├── admin-code.ejs
│   ├── bookmarks.ejs
│   ├── create-event.ejs
│   ├── create-report.ejs
│   ├── delete-event.ejs
│   ├── event-details.ejs
│   ├── events.ejs
│   ├── login.ejs
│   ├── my-reports.ejs
│   ├── my-rsvps.ejs
│   ├── profile.ejs
│   ├── register.ejs
│   ├── reports.ejs
│   ├── rsvp.ejs
│   ├── studenthome.ejs
│   └── update-details.ejs
│
└── public/
    ├── index.html
    ├── images/
    │   └── default.jpg
    └── uploads/
```

## Notes
- All event dates must be set in the future due to form validation rules.
- Past events cannot be edited or deleted — they are view-only.
- Event status (Upcoming / Ongoing / Past) is automatically calculated based on today's date.
- Event images are stored in `public/uploads/` and served statically.
- Students must be logged in to view events, RSVP, comment, or bookmark events.
