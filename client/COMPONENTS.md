# Frontend Components Documentation

## Component Architecture

The application follows a modular component architecture with clear separation of concerns and TypeScript interfaces for type safety.

## 🏗️ Component Structure

### Core Layout Components

#### `Header.tsx`
**Purpose**: Main navigation header with responsive design
**Features**:
- Logo and branding
- Navigation menu (desktop/mobile)
- Theme toggle (dark/light mode)
- Student login trigger
- Mobile hamburger menu

**Props**: None (self-contained)
**Context**: Uses `QueryContext` for theme state

```typescript
interface HeaderProps {
  // No external props - self-contained component
}
```

#### `Footer.tsx`
**Purpose**: Site footer with admin access
**Features**:
- Contact information
- Social media links
- Admin login trigger
- Company branding

**Props**:
```typescript
interface FooterProps {
  onAdminLogin: () => void;
}
```

### Landing Page Sections

#### `Hero.tsx`
**Purpose**: Main landing section with dynamic statistics
**Features**:
- ENEM course branding
- Real-time student/course counts from backend
- Call-to-action buttons
- Responsive layout

**Props**: None
**API Calls**: 
- `/alunos` - Student count
- `/cursos` - Course count

#### `CoursesSection.tsx`
**Purpose**: Display courses organized by knowledge areas
**Features**:
- Knowledge area filtering
- Course cards with details
- Enrollment modal integration
- Responsive grid layout

**Props**:
```typescript
interface CoursesSectionProps {
  onEnrollClick: (course: Course) => void;
}
```

**Data Types**:
```typescript
interface Course {
  id: number;
  nome: string;
  descricao: string;
  professor: Professor;
  areaConhecimento: AreaConhecimento;
}
```

#### `PalestrasSection.tsx`
**Purpose**: Display supplementary lectures and seminars
**Features**:
- Lecture cards with details
- Date/time information
- Registration links
- Professor information

**Props**: None
**API Calls**: `/palestras`

#### `TestimonialsSection.tsx`
**Purpose**: Student success stories and social proof
**Features**:
- Student testimonials
- Success metrics
- Trust signals
- Rotating testimonials

**Props**: None (static content with dynamic elements)

#### `PricingSection.tsx`
**Purpose**: Course pricing plans and payment options
**Features**:
- Multiple pricing tiers
- Monthly/yearly billing toggle
- Feature comparison
- Call-to-action buttons

**Props**: None (self-contained)

#### `FAQSection.tsx`
**Purpose**: Frequently asked questions with interactive interface
**Features**:
- Categorized questions
- Accordion interface
- Search functionality
- Expandable answers

**Props**: None
**State Management**: Local state for expanded questions

### Modal Components

#### `AdminLogin.tsx`
**Purpose**: Admin authentication modal
**Features**:
- Username/password form
- Authentication handling
- Success callback
- Error handling

**Props**:
```typescript
interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}
```

#### `StudentLogin.tsx`
**Purpose**: Student portal access modal
**Features**:
- Student authentication
- Demo dashboard display
- Course progress tracking
- Achievement system

**Props**:
```typescript
interface StudentLoginProps {
  isOpen: boolean;
  onClose: () => void;
}
```

#### `EnrollmentModal.tsx`
**Purpose**: 3-step student enrollment process
**Features**:
- Personal data form
- Address information
- Payment method selection
- Form validation

**Props**:
```typescript
interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
}
```

**Steps**:
1. Personal Information
2. Address Details
3. Payment Selection

### Dashboard Components

#### `AdminDashboard.tsx`
**Purpose**: Comprehensive admin control panel
**Features**:
- Real-time statistics
- Student management
- Course analytics
- Revenue tracking
- Query visualization

**Props**:
```typescript
interface AdminDashboardProps {
  onClose: () => void;
}
```

**API Calls**:
- `/alunos` - Student data
- `/cursos` - Course information
- `/professores` - Professor stats
- `/palestras` - Lecture data

### Utility Components

#### `QueryDisplay.tsx`
**Purpose**: Educational SQL query visualization
**Features**:
- Real-time query display
- Syntax highlighting
- Query categorization
- Educational annotations

**Props**: None
**Context**: Uses `QueryContext` for query state

## 🎨 Styling Approach

### Tailwind CSS Configuration
- **Custom Colors**: Extended palette for branding
- **Dark Mode**: Class-based dark mode support
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable utility classes

### Theme System
```typescript
// Tailwind color extensions
colors: {
  primary: {
    50: '#eff6ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  },
  // ... additional colors
}
```

### Component Styling Patterns
- **Consistent Spacing**: Using Tailwind spacing scale
- **Responsive Breakpoints**: sm, md, lg, xl
- **Animation Classes**: Smooth transitions and hover effects
- **Component Variants**: Different styles for different contexts

## 🔄 State Management

### QueryContext
**Purpose**: Global state for SQL query tracking
**Location**: `src/contexts/QueryContext.tsx`

```typescript
interface QueryContextType {
  queries: string[];
  addQuery: (query: string) => void;
  clearQueries: () => void;
}
```

### Local State Patterns
- **Form State**: Controlled components with useState
- **Modal State**: Boolean flags for modal visibility
- **Loading State**: Async operation tracking
- **Error State**: Error boundary and error handling

## 🔌 API Integration

### Environment Configuration
```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000

// Usage in components
const API_URL = process.env.NEXT_PUBLIC_API_URL;
```

### API Call Patterns
```typescript
// Standard fetch pattern
const fetchData = async () => {
  try {
    const response = await fetch(`${API_URL}/endpoint`);
    const data = await response.json();
    // Handle data
  } catch (error) {
    // Handle error
  }
};
```

### Query Integration
All API calls automatically log to QueryContext for educational purposes:
```typescript
const { addQuery } = useQuery();
// After API call
addQuery(`SELECT * FROM table_name`);
```

## 📱 Responsive Design Patterns

### Breakpoint Strategy
- **Mobile First**: Base styles for mobile
- **Progressive Enhancement**: Add desktop features
- **Touch Friendly**: Larger tap targets on mobile
- **Navigation**: Hamburger menu for mobile

### Layout Patterns
```typescript
// Responsive grid example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Responsive text
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Responsive Heading
</h1>
```

## 🎯 Performance Optimization

### Code Splitting
- **Dynamic Imports**: Lazy loading for modals
- **Route-based**: Automatic with Next.js App Router
- **Component-based**: React.lazy for heavy components

### Image Optimization
- **Next.js Image**: Automatic optimization
- **WebP Support**: Modern format support
- **Lazy Loading**: Intersection Observer API

### Bundle Optimization
- **Tree Shaking**: Automatic with Next.js
- **Minification**: Production builds
- **Compression**: Gzip/Brotli support

## 🧪 Component Testing Strategy

### Testing Approach
1. **Unit Tests**: Individual component logic
2. **Integration Tests**: Component interactions
3. **Visual Tests**: UI consistency
4. **Accessibility Tests**: WCAG compliance

### Testing Tools (Future Implementation)
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **MSW**: API mocking
- **Playwright**: E2E testing

## 🔧 Development Guidelines

### Component Creation Checklist
- [ ] TypeScript interfaces defined
- [ ] Responsive design implemented
- [ ] Error handling included
- [ ] Loading states managed
- [ ] Accessibility considered
- [ ] Context integration (if needed)
- [ ] Props documentation

### Code Style
- **Naming**: PascalCase for components, camelCase for functions
- **File Structure**: One component per file
- **Import Order**: External → Internal → Relative
- **TypeScript**: Strict mode enabled

### Performance Guidelines
- **Memoization**: React.memo for expensive renders
- **Callback Optimization**: useCallback for event handlers
- **Effect Dependencies**: Proper dependency arrays
- **Bundle Size**: Monitor with webpack-bundle-analyzer

---

This documentation provides a comprehensive overview of the frontend component architecture, helping developers understand the structure, patterns, and conventions used throughout the application.
