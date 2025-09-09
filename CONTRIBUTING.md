# Contributing to Rhey

We love your input! We want to make contributing to Rhey as easy and transparent as possible.

## Development Process

1. **Fork** the repository
2. **Clone** your fork locally  
3. **Install** dependencies: `npm install`
4. **Create** a feature branch: `git checkout -b my-feature`
5. **Make** your changes
6. **Test** your changes: `npm test`
7. **Build** the project: `npm run build`
8. **Commit** your changes: `git commit -m 'Add amazing feature'`
9. **Push** to your branch: `git push origin my-feature`
10. **Create** a Pull Request

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/rhey.git
cd rhey

# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Build the project
npm run build

# Check bundle size
npm run size
```

## Code Style

We use ESLint and Prettier for code formatting:

```bash
# Lint code
npm run lint

# Format code  
npm run format

# Type check
npm run type-check
```

## Testing

- Write tests for all new features
- Ensure all tests pass: `npm test`
- Maintain test coverage above 80%
- Test both TypeScript and JavaScript usage

## Commit Messages

We follow [Conventional Commits](https://conventionalcommits.org/):

- `feat: add new slicing feature`
- `fix: resolve query update issue`  
- `docs: update API documentation`
- `test: add tests for object methods`
- `refactor: optimize proxy handler`

## Pull Requests

- **Small PRs** are better than large ones
- **Clear descriptions** of what and why
- **Link issues** that the PR addresses
- **Update documentation** if needed
- **Add tests** for new functionality

## Feature Requests

Before implementing a new feature:

1. **Check existing issues** to avoid duplicates
2. **Open an issue** to discuss the feature
3. **Wait for maintainer feedback** before starting work
4. **Follow the roadmap** - some features might be planned for future versions

## Bug Reports

Great bug reports include:

- **Clear description** of the issue
- **Steps to reproduce** the bug
- **Expected vs actual** behavior  
- **Code examples** that demonstrate the issue
- **Environment details** (Node.js version, TypeScript version, etc.)

## Questions?

Feel free to open an issue with the `question` label if you need help!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.