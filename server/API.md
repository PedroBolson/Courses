# Backend API Documentation

## Overview

The backend is built with NestJS and provides RESTful API endpoints for the ENEM preparatory course platform. It uses PostgreSQL with TypeORM for database management and includes CORS configuration for frontend communication.

## 🚀 Getting Started

### Server Configuration
- **Port**: 8000
- **CORS**: Enabled for `http://localhost:3000`
- **Database**: PostgreSQL with TypeORM
- **Environment**: Development/Production ready

### Base URL
```
http://localhost:8000
```

## 📊 Database Entities

### Student (`alunos`)
```typescript
interface Aluno {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: Date;
  endereco?: string;
  dataMatricula: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Professor (`professores`)
```typescript
interface Professor {
  id: number;
  nome: string;
  email: string;
  especialidade: string;
  biografia?: string;
  telefone?: string;
  createdAt: Date;
  updatedAt: Date;
  cursos: Curso[];
}
```

### Course (`cursos`)
```typescript
interface Curso {
  id: number;
  nome: string;
  descricao: string;
  cargaHoraria: number;
  preco: number;
  professor: Professor;
  areaConhecimento: AreaConhecimento;
  createdAt: Date;
  updatedAt: Date;
}
```

### Knowledge Area (`areas_conhecimento`)
```typescript
interface AreaConhecimento {
  id: number;
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
  createdAt: Date;
  updatedAt: Date;
  cursos: Curso[];
}
```

### Lecture (`palestras`)
```typescript
interface Palestra {
  id: number;
  titulo: string;
  descricao: string;
  data: Date;
  duracao: number;
  professor: Professor;
  local: string;
  vagas: number;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🛣️ API Endpoints

### Students (`/alunos`)

#### GET `/alunos`
**Description**: Retrieve all students
**Response**: Array of student objects
**Query Logging**: `SELECT * FROM alunos`

```typescript
// Response
Aluno[]
```

#### GET `/alunos/:id`
**Description**: Retrieve student by ID
**Parameters**: `id` (number)
**Response**: Single student object
**Query Logging**: `SELECT * FROM alunos WHERE id = :id`

#### POST `/alunos`
**Description**: Create new student
**Body**: Student data (without id, dates)
**Response**: Created student object

```typescript
// Request Body
{
  nome: string;
  email: string;
  telefone?: string;
  dataNascimento?: string; // ISO date
  endereco?: string;
}
```

#### PUT `/alunos/:id`
**Description**: Update existing student
**Parameters**: `id` (number)
**Body**: Updated student data
**Response**: Updated student object

#### DELETE `/alunos/:id`
**Description**: Delete student
**Parameters**: `id` (number)
**Response**: Success message

### Professors (`/professores`)

#### GET `/professores`
**Description**: Retrieve all professors with their courses
**Response**: Array of professor objects with relations
**Query Logging**: `SELECT * FROM professores LEFT JOIN cursos ON...`

#### GET `/professores/:id`
**Description**: Retrieve professor by ID
**Parameters**: `id` (number)
**Response**: Single professor object with courses

#### POST `/professores`
**Description**: Create new professor
**Body**: Professor data

```typescript
// Request Body
{
  nome: string;
  email: string;
  especialidade: string;
  biografia?: string;
  telefone?: string;
}
```

### Courses (`/cursos`)

#### GET `/cursos`
**Description**: Retrieve all courses with professor and area relations
**Response**: Array of course objects
**Query Logging**: Complex JOIN query with relations

#### GET `/cursos/:id`
**Description**: Retrieve course by ID
**Parameters**: `id` (number)
**Response**: Single course object with all relations

#### POST `/cursos`
**Description**: Create new course
**Body**: Course data with professor and area IDs

```typescript
// Request Body
{
  nome: string;
  descricao: string;
  cargaHoraria: number;
  preco: number;
  professorId: number;
  areaConhecimentoId: number;
}
```

### Knowledge Areas (`/areas-conhecimento`)

#### GET `/areas-conhecimento`
**Description**: Retrieve all knowledge areas with course count
**Response**: Array of knowledge area objects
**Query Logging**: `SELECT * FROM areas_conhecimento`

#### POST `/areas-conhecimento`
**Description**: Create new knowledge area
**Body**: Knowledge area data

```typescript
// Request Body
{
  nome: string;
  descricao: string;
  cor: string;
  icone: string;
}
```

### Lectures (`/palestras`)

#### GET `/palestras`
**Description**: Retrieve all lectures with professor information
**Response**: Array of lecture objects
**Query Logging**: `SELECT * FROM palestras LEFT JOIN professores...`

#### POST `/palestras`
**Description**: Create new lecture
**Body**: Lecture data

```typescript
// Request Body
{
  titulo: string;
  descricao: string;
  data: string; // ISO date
  duracao: number;
  professorId: number;
  local: string;
  vagas: number;
}
```

## 🔧 Configuration

### CORS Setup
```typescript
// main.ts
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

### Database Configuration
```typescript
// app.module.ts
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'your_username',
  password: 'your_password',
  database: 'courses_db',
  entities: [Aluno, Professor, Curso, AreaConhecimento, Palestra],
  synchronize: true, // Only for development
})
```

### Port Configuration
```typescript
// main.ts
const port = process.env.PORT || 8000;
await app.listen(port);
```

## 🎯 Special Features

### Query Logging
All database operations are logged for educational purposes. The frontend receives simulated SQL queries that correspond to the actual TypeORM operations:

```typescript
// Example logged queries
"SELECT * FROM alunos ORDER BY dataMatricula DESC"
"SELECT c.*, p.nome as professor_nome FROM cursos c LEFT JOIN professores p ON c.professorId = p.id"
"INSERT INTO alunos (nome, email, telefone) VALUES ($1, $2, $3)"
```

### Error Handling
- **Validation Errors**: Proper HTTP status codes
- **Database Errors**: Graceful error responses
- **Not Found**: 404 for non-existent resources
- **Server Errors**: 500 with error logging

### Response Format
```typescript
// Success Response
{
  data: T | T[],
  message?: string,
  timestamp: string
}

// Error Response
{
  error: string,
  message: string,
  statusCode: number,
  timestamp: string
}
```

## 🔐 Authentication (Future Implementation)

### JWT Strategy
```typescript
// Planned implementation
interface JWTPayload {
  sub: number;
  email: string;
  role: 'admin' | 'student';
  iat: number;
  exp: number;
}
```

### Protected Routes
```typescript
// Future protected endpoints
POST   /auth/login
POST   /auth/register
GET    /auth/profile
POST   /auth/refresh
DELETE /auth/logout
```

## 📈 Analytics Endpoints (Planned)

### Dashboard Stats
```typescript
GET /stats/overview
// Response
{
  totalStudents: number;
  totalCourses: number;
  totalProfessors: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

GET /stats/enrollments
// Monthly enrollment data

GET /stats/popular-courses
// Most enrolled courses
```

## 🧪 Sample Data

### Pre-populated Data
The system includes sample data for demonstration:

- **4 Knowledge Areas**: Ciências da Natureza, Ciências Humanas, Linguagens, Matemática
- **5 Professors**: Specialists in different areas
- **6 Courses**: Distributed across knowledge areas
- **3 Lectures**: Supplementary educational events
- **Multiple Students**: Sample enrollment data

### Sample API Calls for Data Population
```bash
# Create Knowledge Area
POST /areas-conhecimento
{
  "nome": "Ciências da Natureza",
  "descricao": "Biologia, Física, Química",
  "cor": "#10b981",
  "icone": "🧪"
}

# Create Professor
POST /professores
{
  "nome": "Dr. Maria Silva",
  "email": "maria@email.com",
  "especialidade": "Biologia"
}

# Create Course
POST /cursos
{
  "nome": "Biologia Completa",
  "descricao": "Curso completo de Biologia",
  "cargaHoraria": 120,
  "preco": 299.90,
  "professorId": 1,
  "areaConhecimentoId": 1
}
```

## 🚀 Performance Optimization

### Database Optimization
- **Indexing**: Proper indexes on frequently queried columns
- **Relations**: Eager/lazy loading strategies
- **Connection Pooling**: PostgreSQL connection management
- **Query Optimization**: Efficient JOIN operations

### Caching Strategy (Future)
- **Redis Integration**: For frequently accessed data
- **Response Caching**: Cache API responses
- **Database Query Caching**: Cache expensive queries

## 📊 Monitoring and Logging

### Request Logging
```typescript
// All requests logged with:
- Method and URL
- Request body (sanitized)
- Response status
- Response time
- Database queries executed
```

### Health Check
```typescript
GET /health
// Response
{
  status: 'ok',
  database: 'connected',
  uptime: number,
  memory: object,
  timestamp: string
}
```

## 🔧 Development Guidelines

### API Design Principles
- **RESTful**: Following REST conventions
- **Consistent**: Uniform response formats
- **Versioned**: Future API versioning support
- **Documented**: Comprehensive documentation
- **Tested**: Unit and integration tests

### Error Handling Best Practices
```typescript
// Validation errors
{
  statusCode: 400,
  message: ["email must be a valid email"],
  error: "Bad Request"
}

// Not found errors
{
  statusCode: 404,
  message: "Student with ID 999 not found",
  error: "Not Found"
}
```

### Security Considerations
- **Input Validation**: DTO validation with class-validator
- **SQL Injection**: Protected by TypeORM
- **CORS**: Properly configured
- **Rate Limiting**: Future implementation
- **Authentication**: JWT-based (planned)

---

This API documentation provides a comprehensive overview of the backend architecture, endpoints, and integration patterns for the ENEM preparatory course platform.
