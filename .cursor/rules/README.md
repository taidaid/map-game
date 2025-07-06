# Cursor Rules for Map Game Development

This directory contains comprehensive cursor rules that implement a self-correcting feedback loop through automated tooling and clear documentation practices.

## 📋 Available Rules

### ⚛️ [`atomic-commits.mdc`](./atomic-commits.mdc)
**Purpose**: Encourages minimal, focused commits that accomplish one specific goal with clear, testable changes

**Key Features**:
- Single purpose principle enforcement
- Atomic commit size guidelines (1-3 files, <50 lines)
- Conventional commit format examples
- Change breakdown strategies
- Integration with testing workflow

### 🔄 [`automated-validation.mdc`](./automated-validation.mdc)
**Purpose**: Enforces automated validation and self-correcting feedback through testing and tooling

**Key Features**:
- Pre-development validation checks
- Continuous feedback during development  
- Post-development quality gates
- TypeScript, ESLint, and test automation
- Fail-fast principles with deterministic outcomes

### 📚 [`documentation-consolidation.mdc`](./documentation-consolidation.mdc)
**Purpose**: Prevents duplicate knowledge across documentation files by ensuring single source of truth

**Key Features**:
- Documentation authority map enforcement
- Anti-duplication pattern detection
- Cross-reference validation
- Single source of truth principle
- Automated consolidation guidance

### 📚 [`documentation-progress.mdc`](./documentation-progress.mdc)
**Purpose**: Maintains comprehensive documentation and progress tracking

**Key Features**:
- Progress checklist management across all documentation
- Consistent documentation formatting standards
- Feature lifecycle tracking (planned → in-progress → completed)
- Multi-document synchronization requirements

### 🔧 [`code-quality-typescript.mdc`](./code-quality-typescript.mdc)
**Purpose**: Ensures consistent code quality and TypeScript best practices

**Key Features**:
- TypeScript compilation standards
- React component conventions
- File organization patterns
- Testing requirements and coverage standards
- ESLint compliance enforcement

### 📁 [`project-structure.mdc`](./project-structure.mdc)
**Purpose**: Maintains consistent project structure and development conventions

**Key Features**:
- Established directory structure enforcement
- File naming conventions
- Migration-friendly architecture patterns
- Integration point definitions
- Quality assurance standards

### 🔄 [`development-workflow.mdc`](./development-workflow.mdc)
**Purpose**: Defines the complete development workflow and best practices

**Key Features**:
- End-to-end development workflow
- Feature completion checklists  
- Quality gates and validation requirements
- Test-driven development approach
- Integration strategy guidelines

### 📍 [`cursor-rules-location.mdc`](./cursor-rules-location.mdc)
**Purpose**: Standards for placing Cursor rule files in the correct directory

**Key Features**:
- Rule file location enforcement
- Naming convention standards
- Directory structure requirements

## 🎯 Self-Correcting Feedback Loop

The rules implement a comprehensive feedback loop:

### 1. **Before Development**
- Validate current state with `npm run test:all`
- Ensure clean working directory
- Review documentation for requirements

### 2. **During Development**
- Use `npm run test:watch` for continuous validation
- Run `npx tsc --noEmit` for TypeScript checking
- Follow established patterns and conventions

### 3. **After Development**
- Run full validation suite (`npm run test:all`)
- Update documentation and progress tracking
- Ensure all quality gates pass

## 🛠️ Automated Quality Gates

All rules enforce these quality standards:

- ✅ **TypeScript**: No compilation errors
- ✅ **ESLint**: No linting violations  
- ✅ **Unit Tests**: All 32+ tests passing
- ✅ **E2E Tests**: All 102+ tests passing
- ✅ **Coverage**: Maintain 100% on application code
- ✅ **Documentation**: Progress tracking current

## 📊 Integration with Project

The rules are designed to work with our established:

### **Documentation Structure**
- `README.md` - Development progress and setup
- `ARCHITECTURE.md` - Technical implementation
- `PRODUCT.md` - Product features and vision
- `QA.md` - Testing strategy and coverage

### **Testing Framework**
- **Unit Tests**: Vitest + React Testing Library
- **E2E Tests**: Playwright cross-browser testing
- **Coverage**: 100% application code coverage
- **Quality**: Professional-grade test automation

### **Development Stack**
- **Frontend**: React 18 + Vite
- **TypeScript**: Type safety and compilation
- **ESLint**: Code quality and consistency
- **Testing**: Comprehensive test coverage

## 🎮 Usage

These rules automatically activate when:
- Creating or saving JavaScript/TypeScript files
- Creating or saving documentation files
- Making changes to project structure
- Working with JSON configuration files

The rules provide contextual suggestions and enforce established patterns to maintain code quality and project consistency.

## 🔮 Future Enhancements

As the project evolves, these rules can be extended to include:
- Backend integration patterns
- API development standards  
- Database migration guidelines
- Deployment and CI/CD requirements
- Performance optimization standards

---

*These cursor rules serve as the foundation for maintaining high-quality, well-documented, and thoroughly tested code throughout the Map Game development lifecycle.*

## Recent Updates

**2024-12-19**: 
- **Atomic Commits**: Added `atomic-commits.mdc` rule to encourage minimal, focused commits with single-purpose changes and conventional commit format.
- **Commitizen Integration**: Installed and configured Commitizen (`npm run commit`) for interactive, standardized commit message creation.
- **Documentation Consolidation**: Implemented comprehensive documentation consolidation to eliminate duplicate knowledge across all documentation files. Added `documentation-consolidation.mdc` rule to prevent future duplication.
- **Single Source of Truth**: Established clear authority map where each type of information exists in only one authoritative document with cross-references instead of duplication.
- **Enhanced Navigation**: All documentation now includes Related Documentation sections and Next Steps navigation to minimize context switching during development. 