# Staging Workflow

## Overview
This project uses a staging branch workflow to avoid local development server issues and ensure stable deployments.

## Workflow

### Development Process
1. **Work on staging branch**: All development work should be done on the `staging` branch
2. **Push to staging**: Push changes to the `staging` branch for testing
3. **Test on staging environment**: Use the staging environment to test changes
4. **Merge to main**: Once tested and approved, merge staging into main/master

### Commands

#### Starting Development
```bash
# Ensure you're on staging branch
git checkout staging

# Pull latest changes
git pull origin staging
```

#### Making Changes
```bash
# Make your changes
# ... edit files ...

# Add and commit changes
git add .
git commit -m "Description of changes"

# Push to staging
git push origin staging
```

#### Merging to Main
```bash
# Switch to main branch
git checkout main

# Pull latest main
git pull origin main

# Merge staging into main
git merge staging

# Push to main
git push origin main

# Switch back to staging for next development cycle
git checkout staging
```

### Benefits
- Avoids local development server issues
- Provides a stable testing environment
- Enables team collaboration
- Maintains clean main/master branch
- Allows for proper code review process

### Staging Environment
The staging environment will be deployed from the `staging` branch and can be used for:
- Testing new features
- QA validation
- Client demos
- Integration testing

## Notes
- Always work on the `staging` branch for new features
- Only merge to `main` when features are tested and ready
- Use meaningful commit messages
- Consider creating feature branches from staging for complex features 