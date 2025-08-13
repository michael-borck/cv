# Repository Setup Guide

## Recommended GitHub Structure

You should use **TWO separate repositories** for optimal organization:

### 1. Profile Repository: `michael-borck/michael-borck`
- **Purpose**: GitHub profile README that appears on your profile page
- **Content**: Brief, engaging introduction (see PROFILE_README.md)
- **Location**: https://github.com/michael-borck/michael-borck
- **File**: Just README.md

### 2. CV Repository: `michael-borck/cv` (this repo)
- **Purpose**: Complete CV system with Quarto
- **Content**: Full single-source-of-truth CV system
- **Location**: https://github.com/michael-borck/cv
- **Deployment**: https://michael-borck.github.io/cv

## Setup Instructions

### Step 1: Create Profile Repository
```bash
# Create new repo named exactly as your username
# Go to GitHub and create: michael-borck/michael-borck
# Then locally:
mkdir ~/michael-borck-profile
cd ~/michael-borck-profile
git init
cp /path/to/cv/PROFILE_README.md ./README.md
git add README.md
git commit -m "Initial profile README"
git remote add origin https://github.com/michael-borck/michael-borck.git
git push -u origin main
```

### Step 2: Setup CV Repository (this one)
```bash
# In current cv directory
git remote add origin https://github.com/michael-borck/cv.git
git add .
git commit -m "Initial CV system setup"
git push -u origin main
```

### Step 3: Enable GitHub Pages for CV
1. Go to https://github.com/michael-borck/cv/settings/pages
2. Source: Deploy from a branch
3. Branch: `gh-pages` (will be created by GitHub Actions)
4. Wait for first workflow run
5. CV will be live at: https://michael-borck.github.io/cv

### Step 4: Update Profile Links
Ensure your profile README points to the correct CV URL:
- `https://michael-borck.github.io/cv` for the HTML version
- Can also link to specific formats:
  - `/cv-michael-borck.pdf`
  - `/cv-michael-borck-slides.html`

## Why This Structure?

### Benefits of Separation

1. **Clean Profile**: Your GitHub profile stays concise and welcoming
2. **Technical Documentation**: CV repo can have detailed technical docs
3. **Separation of Concerns**: Profile is marketing, CV repo is technical
4. **Better SEO**: Each repo serves its specific purpose
5. **Easier Maintenance**: Update profile and CV independently

### What Goes Where?

**Profile Repo (`michael-borck`)**:
- Quick introduction
- Key achievements
- Links to projects
- Contact information
- Personality/style

**CV Repo (`cv`)**:
- Full CV system
- Technical documentation
- Build instructions
- Contribution guidelines
- Version history

## Alternative: Single Repo Approach

If you prefer one repository, you could:
1. Use `michael-borck/michael-borck`
2. Put CV system in subdirectory
3. Keep README.md as profile
4. Add `CV_SYSTEM.md` for documentation

But the two-repo approach is cleaner and more maintainable.

## Quick Commands

```bash
# After setup, your workflow is:
cd ~/cv
make edit        # Edit cv-data.yml
make all         # Generate all formats
make push        # Commit and push changes

# CV automatically deploys to GitHub Pages
# Profile README is separate and stable
```

## Next Steps

1. Create `michael-borck/michael-borck` repository
2. Copy PROFILE_README.md content to it
3. Push this CV repo to `michael-borck/cv`
4. Enable GitHub Pages
5. Update any existing links to point to new locations