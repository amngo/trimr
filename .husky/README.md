# Git Hooks Configuration

This directory contains Git hooks managed by Husky to ensure code quality and consistency.

## Hooks

### pre-commit

Runs before each commit:

- **Lint-staged**: Lints and formats only staged files
- **TypeScript**: Type checking across the entire project
- **Tests**: Runs all tests to ensure nothing is broken

### pre-push

Runs before pushing to remote:

- **Build**: Ensures the project builds successfully
- **Test Coverage**: Runs tests with coverage report

### commit-msg

Validates commit message format:

- Enforces [Conventional Commits](https://www.conventionalcommits.org/) format
- Pattern: `type(scope): description`
- Examples: `feat: add authentication`, `fix(api): resolve CORS issue`

## Available Commands

```bash
# Run all validations manually
npm run validate

# Fix linting issues
npm run lint:fix

# Format all files
npm run format

# Check formatting
npm run format:check

# Type checking only
npm run type-check

# Interactive test mode
npm run test:ui
```

## Bypassing Hooks

If you need to bypass hooks in emergency situations:

```bash
# Skip pre-commit hook
git commit --no-verify

# Skip pre-push hook
git push --no-verify
```

**Note**: Use `--no-verify` sparingly and only when absolutely necessary.
