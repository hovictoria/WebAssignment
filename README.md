# Campus Event Board - IS113 Project

## Team Members
| Name       | Feature                        |
|------------|--------------------------------|
| Wansim     | Event Management (CRUD)        |
| Yijun      | RSVP System                    |
| Basile     | Comments / Reviews             |
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


4. **Configure environment variables**

Create a `.env` file in the root folder with the following:
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/webdev
SESSION_SECRET=your_secret_key
PORT=8000

---

## Running the Application

Then open your browser and go to:
---

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
- **Collections:** `users`, `events`, `rsvp`, `review`, `category`, `bookmark`, `report`
- **MongoDB URI:**
- mongodb+srv://<username>:<password>@<cluster>.mongodb.net/webdev


> ⚠️ Ensure your IP address is whitelisted on MongoDB Atlas before running.

---

## Features & Functionality

### 1. Event Management (Wansim)
- **Create:** Post a new campus event with title, date, location, description and category
- **Read:** Browse all events on the event listing page; click into individual event details
- **Update:** Edit event title, date, venue, description, and category
- **Delete:** Remove an event permanently

### 2. RSVP System (Yijun)
- **Create:** RSVP to an event with a status (Going / Maybe / Not Going)
- **Read:** View attendee list for an event; view your personal RSVP history
- **Update:** Change your RSVP status (e.g. Going → Maybe)
- **Delete:** Cancel your RSVP

### 3. Comments / Reviews (Basile)
- **Create:** Post a comment or review under an event
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
│   └── auth-middleware.js
│
├── routes/
│   ├── eventRoutes.js
│   ├── userRoutes.js
│   ├── rsvpRoutes.js
│   ├── reviewRoutes.js
│   ├── bookmarkRoutes.js
│   └── reportRoutes.js
│
├── controllers/
│   ├── eventController.js
│   ├── userController.js
│   ├── rsvpController.js
│   ├── reviewController.js
│   ├── bookmarkController.js
│   └── reportController.js
│
├── models/
│   ├── eventModel.js
│   ├── userModel.js
│   ├── rsvpModel.js
│   ├── reviewModel.js
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
    └── index.html
```

## Notes
- All event dates must be set in the future due to form validation rules.
- Only Admins can delete events and manage reports.
- Students must be logged in to RSVP, comment, or bookmark events.
