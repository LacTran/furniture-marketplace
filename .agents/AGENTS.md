# Real-World Software Engineering & Workflow Guidelines

## 1. Branching Strategy & PR Discipline
* **Feature Branches**: All implementation work must be developed on a dedicated branch (`feature/<name>`, `fix/<name>`, `refactor/<name>`). Direct commits to `main` for new features are prohibited.
* **Conventional Commits**: Commit messages must follow conventional commits specification:
  * `feat: ...` for new features
  * `fix: ...` for bug fixes
  * `refactor: ...` for code reorganization
  * `ci: ...` for workflow updates
  * `docs: ...` for documentation changes
* **Code Review Workflow**: Every feature branch must be reviewed and pass CI validation before being merged into `main`.

## 2. Automated CI/CD Pipeline
* Every pull request and push triggers `.github/workflows/ci.yml`, enforcing:
  1. `.NET API` release compilation.
  2. `Next.js Web App` static optimization & type checking.
  3. `Expo Mobile App` TypeScript type verification (`tsc --noEmit`).
