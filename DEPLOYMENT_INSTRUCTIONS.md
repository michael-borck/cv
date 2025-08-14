# Deployment Instructions for Resume Portal

## CV Repository (this repo) ✅ COMPLETED
- ✅ CNAME file added with `resume.michaelborck.dev`
- ✅ Professional header added matching michaelborck.dev style
- ✅ Theme toggle implemented (light/dark mode)
- ✅ Footer enhanced with professional links
- ✅ SEO meta tags added

### GitHub Pages Configuration
1. Go to Settings → Pages in this repository
2. Ensure Source is set to "Deploy from a branch"
3. Select "main" branch and "/ (root)" folder
4. Custom domain should show `resume.michaelborck.dev`
5. Enforce HTTPS should be checked

## Cloudflare DNS Configuration
Add the following CNAME record:
- Type: CNAME
- Name: `resume`
- Target: `michael-borck.github.io`
- Proxy status: Proxied (orange cloud)
- TTL: Auto

## michaelborck.dev Repository Changes

### Files to Update:

1. **index.html** - Already modified locally:
   - Changed resume card link from `resume.html` to `https://resume.michaelborck.dev`
   - Updated description to "Interactive resume experiences showcasing my professional journey"

2. **resume-redirect.html** - New file created locally:
   - Auto-redirects to `https://resume.michaelborck.dev`
   - Shows loading animation during redirect
   - Fallback link if redirect fails

### To Deploy michaelborck.dev Changes:
```bash
cd /home/michael/projects/michaelborck.dev
git add index.html resume-redirect.html
git commit -m "Update resume link to subdomain"
git push origin main
```

## Verification Steps
After deployment:
1. Visit https://resume.michaelborck.dev - should show CV Portal
2. Visit https://michaelborck.dev - click Resume card, should go to subdomain
3. Test theme toggle - should work on CV Portal
4. Test navigation links - should go back to main site
5. Check SSL certificate is working

## Timeline
- CV repo changes: Pushed and ready ✅
- DNS changes: Apply in Cloudflare (takes 5-15 minutes to propagate)
- GitHub Pages: May take up to 10 minutes to recognize custom domain
- Main site changes: Push when ready

## Notes
- The CV Portal maintains its creative gradient design while adding professional header
- Theme preference is saved in localStorage and syncs across pages
- Both sites remain in separate repositories for easier maintenance
- The subdomain approach provides clean separation while maintaining brand consistency