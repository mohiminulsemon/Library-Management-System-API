# Library Management System API

## 📖 Project Name & Description
The **Library Management System API** is a backend service designed to manage library operations, including book inventory, member details, and borrowing/returning books. It facilitates seamless operations for libraries, allowing efficient tracking of borrowed books and overdue returns.

---

## 🌐 Live URL
**Live Deployment**: [https://prisma-library-backend.vercel.app/](https://your-backend-url.com)  

---

## 🛠️ Technology Stack & Packages
### Core Technologies:
- **Node.js**: Backend runtime.
- **Express.js**: Web framework for building RESTful APIs.
- **Prisma**: ORM for database interaction.
- **PostgreSQL**: Relational database for storing data.
- **TypeScript**: For type safety and better developer experience.

### Key Packages:
- **uuid**: Generates unique identifiers.
- **http-status-codes**: For consistent HTTP response status codes.
- **dotenv**: Manages environment variables.
- **nodemon**: Enables hot-reloading during development.

---

## ⚙️ Setup Instructions
### Prerequisites:
1. Node.js (v16 or later)
2. PostgreSQL (installed and running)
3. Git (optional for cloning the repository)

### Installation Steps:
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/library-management-api.git
   cd library-management-api
   npm install
   DATABASE_URL=postgresql://<username>:<password>@localhost:5432/library_db
   PORT=5000
   npx prisma migrate dev --name init
   npm run dev 

## 📚 API Endpoints

Below is a list of all available API endpoints for the Library Management System API, categorized by functionality.

---

### 📘 Books API
| HTTP Method | Endpoint          | Description                                     |
|-------------|-------------------|-------------------------------------------------|
| `POST`      | `/api/v1/books`   | Create a new book.                             |
| `GET`       | `/api/v1/books`   | Retrieve all books.                            |
| `GET`       | `/api/v1/books/:bookId` | Retrieve a specific book by its ID.            |
| `PUT`       | `/api/v1/books/:bookId` | Update a specific book's details.              |
| `DELETE`    | `/api/v1/books/:bookId` | Delete a specific book.                        |

---

### 👥 Members API
| HTTP Method | Endpoint             | Description                                     |
|-------------|----------------------|-------------------------------------------------|
| `POST`      | `/api/v1/members`    | Add a new library member.                      |
| `GET`       | `/api/v1/members`    | Retrieve all library members.                  |
| `GET`       | `/api/v1/members/:memberId` | Retrieve a specific member by their ID.        |
| `PUT`       | `/api/v1/members/:memberId` | Update details of a specific member.           |
| `DELETE`    | `/api/v1/members/:memberId` | Delete a library member.                       |

---

### 🔄 Borrow/Return API
| HTTP Method | Endpoint                     | Description                                     |
|-------------|------------------------------|-------------------------------------------------|
| `POST`      | `/api/v1/borrow`             | Borrow a book (requires `bookId` and `memberId`). |
| `POST`      | `/api/v1/return`             | Return a borrowed book (requires `borrowId`).  |
| `GET`       | `/api/v1/borrow/overdue`     | Fetch a list of all overdue books.             |

---

### 🌟 Response Format
All responses follow a standardized JSON format:
```json
{
    "success": true,
    "status": 200,
    "message": "Operation successful",
    "data": {...}
}

