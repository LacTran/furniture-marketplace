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

## 2. Automated CI Pipeline (`.github/workflows/ci.yml`)
* Every pull request and push triggers `.github/workflows/ci.yml`, enforcing:
  1. `.NET API` release compilation.
  2. `Next.js Web App` static optimization & type checking.
  3. `Expo Mobile App` TypeScript type verification (`tsc --noEmit`).

## 3. Continuous Deployment (CD) Pipeline (`.github/workflows/cd.yml`)
* Merges into `main` automatically trigger `.github/workflows/cd.yml` for automated production deployment across all three targets:
  1. **API Backend**: Deploys Dockerized ASP.NET Core API to Render (via `RENDER_DEPLOY_HOOK_URL` / Auto-Deploy).
  2. **Web Client**: Deploys Next.js application to Vercel Production (`VERCEL_TOKEN`).
  3. **Mobile Client**: Publishes Expo OTA updates via EAS CLI (`EXPO_TOKEN`).

## 4. Design System & UI/UX Standards
* **Source of Truth**: All UI components, layouts, colors, and accessibility rules MUST strictly follow [design-system/kyydiss/MASTER.md](./design-system/kyydiss/MASTER.md).
* **Key Enforcement**:
  * No emojis as icons (use standard SVG icons).
  * Minimum 4.5:1 WCAG text contrast ratio.
  * Explicit `cursor-pointer` on all interactive elements.

## 5. Real-World SaaS Transformation Roadmap & User Flow
* **SaaS Roadmap & Architectural Checkpoints**: Documented in [.agents/references/saas_transformation_roadmap.md](./.agents/references/saas_transformation_roadmap.md).
* **SaaS User Flow State Machine**: Documented in [.agents/references/saas_user_flow.md](./.agents/references/saas_user_flow.md).

## 6. Communication & Execution Preferences
* **Inquiry vs. Action**: When the user asks a question, requests a recommendation, or inquires about an idea/approach, explain the concept and outline the proposed plan FIRST. Do NOT execute code edits or modifying commands until the user explicitly confirms or asks to proceed.
