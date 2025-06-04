# ENEM Preparatory Course Platform

A comprehensive web application for ENEM exam preparation, featuring a modern landing page, student portal, and admin dashboard. Built with Next.js, NestJS, TypeScript, and PostgreSQL.

## 🚀 Features

### Landing Page
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Dynamic Statistics**: Real-time data from backend database
- **Course Catalog**: Organized by knowledge areas (Ciências da Natureza, Ciências Humanas, Linguagens, Matemática)
- **Lectures Section**: Information about supplementary lectures and seminars
- **Student Testimonials**: Success stories and trust signals
- **Pricing Plans**: Flexible payment options with billing toggles
- **Interactive FAQ**: Categorized questions with accordion interface
- **Theme Toggle**: Dark/light mode support

### Student Portal
- **Demo Dashboard**: Course progress tracking
- **Achievement System**: Performance badges and milestones
- **Upcoming Tests**: Scheduled assessments
- **Enrollment Process**: 3-step registration (Personal Data → Address → Payment)

### Admin Dashboard
- **Real-time Statistics**: Students, courses, professors count
- **Database Insights**: Revenue tracking and performance metrics
- **SQL Query Visualization**: Live display of executed database queries
- **Authentication System**: Secure admin access

### Special Features
- **Query Display**: Educational feature showing SQL queries executed for database course demonstration
- **Modern UI/UX**: Clean, professional design with smooth animations
- **Full TypeScript**: Type safety throughout the application
- **Error Handling**: Comprehensive error boundaries and loading states

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS with custom color palette
- **Language**: TypeScript
- **State Management**: React Context API
- **UI Components**: Custom components with Headless UI
- **Icons**: Lucide React

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL with TypeORM
- **Language**: TypeScript
- **API**: RESTful endpoints
- **CORS**: Enabled for frontend communication

## 📁 Project Structure

```
Courses/
├── client/                 # Frontend (Next.js)
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── contexts/      # React contexts
│   │   └── ...
│   ├── public/            # Static assets
│   ├── .env.local         # Environment variables
│   └── package.json
├── server/                # Backend (NestJS)
│   ├── src/
│   │   ├── modules/       # Feature modules
│   │   ├── entities/      # Database entities
│   │   └── main.ts        # Application entry point
│   └── package.json
└── README.md
```

## 🚦 Getting Started

### Quick Setup (Recommended)

#### For Linux/Mac:
```bash
chmod +x setup.sh
./setup.sh
```

#### For Windows:
```cmd
setup.bat
```

The setup script will automatically:
- Check prerequisites
- Install dependencies
- Configure environment
- Start both servers
- Populate sample data

See **[QUICKSTART.md](QUICKSTART.md)** for detailed instructions.

### Manual Setup

#### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn package manager

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd Courses
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Configure database connection in src/app.module.ts
# Update PostgreSQL credentials

# Start the backend server
npm run start:dev
```

The backend will run on **http://localhost:8000**

### 3. Frontend Setup

```bash
# Navigate to client directory (new terminal)
cd client

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Update .env.local with:
NEXT_PUBLIC_API_URL=http://localhost:8000

# Start the frontend development server
npm run dev
```

The frontend will run on **http://localhost:3000**

### 4. Database Setup

The application will automatically create the required tables. Sample data will be populated through the admin dashboard or API calls.

## 🔧 Configuration

### Environment Variables

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

#### Backend
Configure database connection in `server/src/app.module.ts`:
```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'your_database',
  // ...
})
```

## 📊 Database Schema

### Core Entities
- **Students** (`alunos`): Student information and enrollment data
- **Professors** (`professores`): Teaching staff details
- **Courses** (`cursos`): Course catalog with knowledge areas
- **Knowledge Areas** (`areas_conhecimento`): ENEM subject categories
- **Lectures** (`palestras`): Supplementary educational events

### Key Features
- **Automatic Timestamps**: Created/updated tracking
- **Relationships**: Proper foreign key constraints
- **Data Validation**: Backend validation with TypeORM decorators

## 🎨 Theming

### Custom Color Palette
- **Primary**: Blue tones for main branding
- **Secondary**: Complementary colors for accents
- **Neutral**: Grayscale for backgrounds and text
- **Warning**: Alert and notification colors
- **Accent**: Highlight colors for CTAs

### Theme Toggle
Users can switch between light and dark modes. The preference is stored in localStorage and applied consistently across all components.

## 🔐 Authentication

### Current Implementation
- **Admin Login**: Mock authentication for demonstration
- **Student Portal**: Demo access with sample data

### Future Enhancements
- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- OAuth integration options

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

Mobile features include:
- Hamburger navigation menu
- Touch-friendly interface
- Optimized loading performance

## 🧪 Testing

### Current Status
- TypeScript compilation validation
- ESLint code quality checks
- Component prop validation

### Future Testing Strategy
- **Unit Tests**: Jest + React Testing Library
- **Integration Tests**: API endpoint testing
- **E2E Tests**: Playwright or Cypress
- **Performance Tests**: Lighthouse CI integration

## 🚀 Deployment

### Development
Both servers run locally:
- Frontend: http://localhost:3000
- Backend: http://localhost:8000

### Production Recommendations
- **Frontend**: Vercel, Netlify, or AWS Amplify
- **Backend**: Railway, Heroku, or AWS ECS
- **Database**: AWS RDS, Google Cloud SQL, or Railway PostgreSQL

## 🐛 Troubleshooting

### Common Issues

#### CORS Errors
- Ensure backend CORS is configured for frontend URL
- Check `main.ts` for proper CORS setup

#### Database Connection
- Verify PostgreSQL is running
- Check connection credentials in `app.module.ts`

#### Environment Variables
- Ensure `.env.local` exists in client directory
- Verify `NEXT_PUBLIC_API_URL` matches backend port

#### Port Conflicts
- Backend default: 8000
- Frontend default: 3000
- Change ports in respective package.json scripts if needed

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is for educational purposes as part of a college database course.

## 📞 Support

For questions about this database course project, please contact the development team or refer to the course materials.

---

**Note**: This is an educational project demonstrating modern web development practices, database integration, and full-stack application architecture for ENEM exam preparation services.
