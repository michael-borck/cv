# Theme Toggle Help

## If the theme toggle breaks:

### Option 1: Reset via Browser Console
Open browser console (F12) and run:
```javascript
localStorage.removeItem('cv-quest-theme');
location.reload();
```

### Option 2: Use Theme Manager
```javascript
window.themeManager.reset();
```

### Option 3: Clear Browser Data
Clear localStorage/cookies for this site in browser settings.

## Theme Files:
- **Retro Theme**: `assets/css/styles.css` (original 8-bit style)
- **Professional Theme**: `assets/css/styles-professional.css` (modern gradient style)
- **Shared Styles**: `assets/css/help-screen-styles.css` (help screen, used by both)

## Known Issues Fixed:
1. Help screen now styled in both themes
2. localStorage error handling added
3. Theme validation to prevent invalid states
4. Reset function available

## To Manually Switch Themes:
- Click the 🎨 button in the header
- Retro mode shows 💼 (switch to professional)
- Professional mode shows 🕹️ (switch to retro)