# Makefile for CV Generation
# Single source of truth CV system using Quarto

.PHONY: all pdf html slides clean install help watch serve

# Default target
all: pdf html slides

# Install dependencies
install:
	@echo "Installing required R packages..."
	@Rscript -e "if (!require('yaml')) install.packages('yaml', repos='https://cloud.r-project.org/')"
	@Rscript -e "if (!require('knitr')) install.packages('knitr', repos='https://cloud.r-project.org/')"
	@Rscript -e "if (!require('rmarkdown')) install.packages('rmarkdown', repos='https://cloud.r-project.org/')"
	@echo "Checking Quarto installation..."
	@quarto --version || echo "Please install Quarto from https://quarto.org/docs/get-started/"

# Generate PDF version
pdf:
	@echo "Generating PDF CV..."
	@mkdir -p output
	@cd src && quarto render cv-template.qmd --to pdf --output ../output/cv-michael-borck.pdf
	@echo "PDF CV generated: output/cv-michael-borck.pdf"

# Generate HTML version
html:
	@echo "Generating HTML CV..."
	@mkdir -p output
	@cd src && quarto render cv-template.qmd --to html --output ../output/cv-michael-borck.html
	@echo "HTML CV generated: output/cv-michael-borck.html"

# Generate Reveal.js slides
slides:
	@echo "Generating Reveal.js presentation..."
	@mkdir -p output
	@cd src && quarto render cv-template.qmd --to revealjs --output ../output/cv-michael-borck-slides.html
	@echo "Reveal.js presentation generated: output/cv-michael-borck-slides.html"

# Watch for changes and auto-rebuild
watch:
	@echo "Watching for changes (HTML output)..."
	@cd src && quarto preview cv-template.qmd --to html --no-browser

# Serve the HTML version locally
serve:
	@echo "Serving HTML CV at http://localhost:8000"
	@cd output && python3 -m http.server 8000 || python -m SimpleHTTPServer 8000

# Clean generated files
clean:
	@echo "Cleaning generated files..."
	@rm -rf output/*
	@rm -rf src/.quarto
	@rm -rf src/*_cache
	@rm -rf src/*_files
	@find . -name "*.aux" -delete
	@find . -name "*.log" -delete
	@find . -name "*.out" -delete
	@echo "Clean complete"

# Validate YAML data
validate:
	@echo "Validating CV data..."
	@python3 -c "import yaml; yaml.safe_load(open('data/cv-data.yml'))" && echo "✓ CV data is valid YAML" || echo "✗ CV data has YAML errors"

# Quick edit of CV data
edit:
	@${EDITOR:-nano} data/cv-data.yml

# Generate all formats and open them
preview: all
	@echo "Opening generated files..."
	@command -v xdg-open >/dev/null 2>&1 && xdg-open output/cv-michael-borck.html || \
	command -v open >/dev/null 2>&1 && open output/cv-michael-borck.html || \
	echo "Please open output/cv-michael-borck.html manually"

# Git operations
commit:
	@git add -A
	@git commit -m "Update CV data and regenerate outputs"
	@echo "Changes committed. Don't forget to push!"

push: commit
	@git push origin main
	@echo "Changes pushed to remote repository"

# Help target
help:
	@echo "CV Generation System - Available Commands:"
	@echo "=========================================="
	@echo "  make all      - Generate all output formats (PDF, HTML, Reveal.js)"
	@echo "  make pdf      - Generate PDF version only"
	@echo "  make html     - Generate HTML version only"
	@echo "  make slides   - Generate Reveal.js presentation only"
	@echo "  make watch    - Watch for changes and auto-rebuild HTML"
	@echo "  make serve    - Serve HTML version locally on port 8000"
	@echo "  make clean    - Remove all generated files"
	@echo "  make validate - Check if cv-data.yml is valid"
	@echo "  make edit     - Open cv-data.yml in your default editor"
	@echo "  make preview  - Generate all formats and open in browser"
	@echo "  make install  - Install required dependencies"
	@echo "  make commit   - Commit all changes to git"
	@echo "  make push     - Commit and push to remote repository"
	@echo "  make help     - Show this help message"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. Edit your CV data: make edit"
	@echo "  2. Generate all formats: make all"
	@echo "  3. Preview the output: make preview"
	@echo ""
	@echo "For continuous development:"
	@echo "  make watch  (in one terminal)"
	@echo "  make serve  (in another terminal)"