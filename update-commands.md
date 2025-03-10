# Run these commands in CMD one by one:

# 1. Navigate to project directory
cd c:\Users\abdal\OneDrive\Desktop\home mansa

# 2. Get latest changes
git fetch origin
git pull origin main

# 3. Install/Update dependencies
npm install

# 4. If you made changes, commit and push them:
git add .
git commit -m "Update project files"
git push origin main

# If you get errors:
# - For git pull errors: git stash && git pull origin main
# - For npm errors: del node_modules && npm install
