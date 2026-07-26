# Comit.md - GitHub Commit Guide

> A quick reference guide for committing changes to this repository.

---

## 📋 Prerequisites

### 1. Configure Git Identity
```bash
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
```

### 2. Set Up Remote with Token
```bash
git remote set-url origin https://GITHUB_TOKEN@github.com/Pankajpavan5/SHIVKRUPA-RESTARURANT-POS.git
```

Or use the encrypted `X.Env`:
```bash
export $(cat X.Env | grep -v '^#' | xargs)
git remote set-url origin https://$(echo $GITHUB_TOKEN | base64 -d)@github.com/Pankajpavan5/SHIVKRUPA-RESTARURANT-POS.git
```

---

## 🔄 Standard Workflow

### 1. Pull Latest Changes
```bash
git pull origin main
```

### 2. Make Your Changes
Edit, create, or delete files as needed.

### 3. Check Status
```bash
git status
```

### 4. Stage Files
```bash
# Stage all changes
git add .

# Stage specific file
git add filename.md

# Stage all changes in current directory
git add .
```

### 5. Commit
```bash
git commit -m "Your descriptive commit message"
```

### 6. Push
```bash
git push origin main
```

---

## ✍️ Commit Message Guidelines

### Format
```
<type>: <subject>

[optional body]

[optional footer]
```

### Types
| Type | Use Case |
|------|----------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation |
| `style` | Formatting (no code change) |
| `refactor` | Code restructuring |
| `test` | Adding tests |
| `chore` | Maintenance tasks |

### Examples
```bash
# Simple
git commit -m "fix: resolve menu item crash"

# With description
git commit -m "docs: update POS system documentation
- Added workflow diagrams
- Documented all state structures
- Included AI usage examples"

# With issue reference
git commit -m "feat: add dark mode toggle
Closes #12"
```

---

## 🔀 Branch Workflow (Optional)

### Create New Branch
```bash
git checkout -b feature/my-new-feature
```

### Switch Branches
```bash
git checkout main
git checkout feature/my-feature
```

### Merge Branch
```bash
git checkout main
git merge feature/my-new-feature
git push origin main
```

---

## 📌 Useful Commands

### View Commit History
```bash
git log
git log --oneline
git log --graph --oneline --all
```

### Undo Changes
```bash
# Unstage a file
git reset HEAD filename

# Discard local changes
git checkout -- filename

# Revert last commit (keep changes)
git reset --soft HEAD~1

# Revert last commit (discard changes)
git reset --hard HEAD~1
```

### View Differences
```bash
# Show unstaged changes
git diff

# Show staged changes
git diff --cached

# Show changes between commits
git diff abc123..def456
```

### Clean Up
```bash
# Remove untracked files
git clean -f

# Preview what will be removed
git clean -n
```

---

## 🚀 Quick Reference

```bash
# Full commit cycle
git add . && git commit -m "message" && git push origin main

# Amend last commit (before push)
git commit --amend -m "Updated message"

# Force push (use carefully!)
git push -f origin main
```

---

## ⚠️ Common Issues

### "Please tell me who you are"
```bash
git config user.email "your@email.com"
git config user.name "Your Name"
```

### "Authentication failed"
```bash
git remote set-url origin https://TOKEN@github.com/USER/REPO.git
```

### "Merge conflict"
1. Open conflicting files
2. Look for `<<<<<<<`, `=======`, `>>>>>>>` markers
3. Keep desired changes, remove markers
4. `git add .` and `git commit -m "Resolve conflict"`

### "Push rejected"
```bash
git pull --rebase origin main
git push origin main
```

---

## 📁 Files to Never Commit

Add these to `.gitignore`:
```
X.Env
.env
*.env
node_modules/
.DS_Store
*.log
dist/
build/
__pycache__/
*.pyc
.vscode/
.idea/
```

---

*Keep this guide handy for quick reference!*
