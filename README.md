# 📓 Penning Pathway

A responsive, full-stack journaling web application that helps users capture their thoughts, organize entries with tags, and reflect on their writing journey — all in a secure, multi-user environment.

---

## ✨ Features

- **Secure Authentication** — Auth0-powered login with multi-user support
- **Journal Entries** — Create, read, update, and delete personal journal entries
- **Tag-Based Categorization** — Organize entries with custom tags for easy filtering
- **External API Integration** — Enhanced journaling experience with third-party API data
- **Responsive Design** — Seamless experience across desktop and mobile devices
- **Performance Optimized** — Lighthouse audited for speed, accessibility, and best practices

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Express.js (Node.js) |
| Database | MySQL via Prisma ORM |
| Authentication | Auth0 |
| Styling | SCSS |
| Deployment | Vercel |

---

## 📁 Project Structure

```
Penning_Pathway/
├── client/                  # React frontend
│   ├── public/
│   └── src/
│       ├── components/      # AppLayout, Home, Journals, JournalDetails, Profile...
│       ├── hooks/           # useJournal custom hook
│       ├── style/           # SCSS stylesheets
│       ├── tests/           # Component test files
│       └── scripts/
├── api/                     # Express.js backend
│   ├── index.js             # Server entry point
│   └── prisma/
│       └── schema.prisma    # Database schema
├── lighthouseReport/        # Performance audit reports
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MySQL database
- Auth0 account

### 1. Clone the repository
```bash
git clone https://github.com/tarun1506/Penning_Pathway.git
cd Penning_Pathway
```

### 2. Set up the API
```bash
cd api
npm install
```

Create a `.env` file in the `api/` folder:
```env
DATABASE_URL="mysql://user:password@localhost:3306/penning_pathway"
AUTH0_AUDIENCE=your_auth0_audience
AUTH0_ISSUER=your_auth0_domain
PORT=5000
```

Run database migrations:
```bash
npx prisma migrate dev
```

Start the server:
```bash
npm start
```

### 3. Set up the Client
```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:
```env
REACT_APP_AUTH0_DOMAIN=your_auth0_domain
REACT_APP_AUTH0_CLIENT_ID=your_auth0_client_id
REACT_APP_AUTH0_AUDIENCE=your_auth0_audience
REACT_APP_API_URL=http://localhost:5000
```

Start the app:
```bash
npm start
```

The app will be running at `http://localhost:3000`

---

## 🧪 Running Tests

```bash
cd client
npm test
```

Test files are located in `client/src/tests/` covering Home, Journal, and Profile components.

---

## 📊 Performance

Lighthouse audit reports are available in the `lighthouseReport/` folder:
- `homePageReport.pdf`
- `journalPageReport.pdf`
- `journalDetailReport.pdf`

---

## 🔐 Authentication Flow

Penning Pathway uses Auth0 for secure authentication:
1. User signs in via Auth0 Universal Login
2. Auth token is stored and passed to the API on each request
3. The API validates the token before serving user-specific data
4. Each user only has access to their own journal entries

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

*Built with ❤️ by [Tarun Mohan](https://github.com/tarun1506)*
