# Single Source CV System

A modern, single-source-of-truth CV system using Quarto that generates PDF, HTML, and Reveal.js presentations from one YAML data file.

## Features

- **Single Source of Truth**: All CV content stored in `data/cv-data.yml`
- **Multiple Output Formats**:
  - 📄 PDF - Professional print-ready CV
  - 🌐 HTML - Interactive web version with modern styling
  - 🎯 Reveal.js - Presentation format for talks/interviews
- **Automated Rendering**: GitHub Actions workflow for automatic generation
- **Self-Contained**: All outputs are self-contained with embedded resources
- **Modern Design**: Professional typography using Source Sans Pro fonts
- **Responsive**: HTML version works on all devices
- **Version Control**: Full git integration for tracking changes

## Project Structure

```
cv/
├── data/
│   └── cv-data.yml         # ⭐ Single source of CV data (EDIT THIS!)
├── src/
│   └── cv-template.qmd     # Quarto template with conditional formatting
├── assets/
│   └── css/
│       ├── custom.css      # HTML styling
│       └── reveal-custom.css # Reveal.js styling
├── output/                 # Generated CV files (git-ignored)
│   ├── cv-michael-borck.pdf
│   ├── cv-michael-borck.html
│   └── cv-michael-borck-slides.html
├── .github/
│   └── workflows/
│       └── render-cv.yml   # GitHub Actions automation
├── _quarto.yml            # Quarto configuration
├── Makefile               # Build automation
└── README.md              # This file
```

## Quick Start

### Prerequisites

1. **Quarto**: Download from [quarto.org](https://quarto.org/docs/get-started/)
2. **R**: Required for YAML processing
3. **R packages**: yaml, knitr, rmarkdown

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd cv

# Install dependencies
make install

# Or manually install R packages
R -e "install.packages(c('yaml', 'knitr', 'rmarkdown'))"
```

## Usage

### Basic Workflow

1. **Edit your CV data**:
   ```bash
   make edit  # Opens data/cv-data.yml in your editor
   ```
   Or directly edit `data/cv-data.yml`

2. **Generate all formats**:
   ```bash
   make all
   ```

3. **Preview the output**:
   ```bash
   make preview  # Opens HTML version in browser
   ```

### Individual Commands

```bash
# Generate specific formats
make pdf      # PDF only
make html     # HTML only
make slides   # Reveal.js only

# Development
make watch    # Auto-rebuild on changes
make serve    # Serve HTML locally (http://localhost:8000)

# Maintenance
make clean    # Remove generated files
make validate # Check YAML syntax

# Git operations
make commit   # Commit all changes
make push     # Commit and push to remote
```

## Editing Your CV

### Structure of cv-data.yml

The YAML file contains sections for:

- **personal**: Contact information
- **summary**: Professional summary
- **teaching**: Teaching philosophy, satisfaction metrics, feedback
- **achievements**: Key career highlights
- **experience**: Work history with responsibilities
- **education**: Academic qualifications
- **publications**: Books, papers, thesis
- **projects**: Open source and educational tools
- **skills**: Technical competencies
- **certifications**: Training and certificates
- **service**: Professional and community service
- **affiliations**: Professional memberships
- **interests**: Personal interests

### Example Edit

To update your phone number:
```yaml
personal:
  phone: "0402 297 573"  # Update this line
```

To add a new job:
```yaml
experience:
  - title: "New Position Title"
    organization: "Company Name"
    location: "City, State"
    period: "Jan 2024 – Present"
    responsibilities:
      - "First responsibility"
      - "Second responsibility"
```

## GitHub Actions

The workflow automatically:
1. Triggers on push to main branch when CV files change
2. Installs all dependencies
3. Generates all three formats
4. Uploads artifacts for download
5. Optionally deploys to GitHub Pages
6. Creates releases on tag push

### Enable GitHub Pages

1. Go to Settings → Pages
2. Set source to "Deploy from a branch"
3. Select `gh-pages` branch
4. Your CV will be available at `https://[username].github.io/[repo-name]/`

## Customization

### Styling

- **HTML**: Edit `assets/css/custom.css`
- **Reveal.js**: Edit `assets/css/reveal-custom.css`
- **PDF**: Modify LaTeX settings in `_quarto.yml`

### Template

Edit `src/cv-template.qmd` to change layout or add sections. Use Quarto's conditional content:

```markdown
::: {.content-visible when-format="html"}
HTML-only content
:::

::: {.content-visible when-format="pdf"}
PDF-only content
:::

::: {.content-visible when-format="revealjs"}
Slides-only content
:::
```

## Tips

1. **Keep it DRY**: Only edit `cv-data.yml`, never the output files
2. **Version Control**: Commit after significant changes
3. **Continuous Development**: Use `make watch` + `make serve` for live preview
4. **Validation**: Run `make validate` before building to catch YAML errors
5. **Clean Builds**: Use `make clean` if you encounter build issues

## Troubleshooting

### Common Issues

1. **Quarto not found**: Install from [quarto.org](https://quarto.org)
2. **R packages missing**: Run `make install` or install manually
3. **PDF generation fails**: Ensure LaTeX is installed (Quarto includes TinyTeX)
4. **YAML errors**: Run `make validate` to check syntax

### Getting Help

- Check Quarto docs: [quarto.org/docs](https://quarto.org/docs)
- Review the Makefile: `make help`
- Examine build logs in GitHub Actions

## License

This CV system is provided as-is for personal use. The CV content remains the property of the individual.

## Credits

Built with:
- [Quarto](https://quarto.org) - Scientific publishing system
- [Reveal.js](https://revealjs.com) - Presentation framework
- [Source Sans Pro](https://fonts.google.com/specimen/Source+Sans+Pro) - Typography

---

**Remember**: The beauty of this system is that you only need to edit `data/cv-data.yml` to update your CV across all formats! 🎉