# Makefile for CV Generation
# Single source of truth CV system using Quarto

.PHONY: all pdf pdf-latex html slides quest terminal magazine api chatbot clean install help watch serve validate edit preview commit push

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

# Generate PDF version (via LaTeX)
pdf-latex:
	@echo "Generating PDF CV via LaTeX..."
	@mkdir -p output
	@cd src && quarto render cv-template-python.qmd --to pdf --output cv-michael-borck.pdf
	@test -f output/src/cv-michael-borck.pdf && mv output/src/cv-michael-borck.pdf output/ || true
	@test -d output/src && rm -rf output/src || true
	@echo "PDF CV generated: output/cv-michael-borck.pdf"

# Generate PDF version (via HTML using various tools)
pdf: html
	@echo "Generating PDF CV from HTML..."
	@if command -v playwright >/dev/null 2>&1 && [ -f html_to_pdf.py ]; then \
		pipx run --spec playwright python html_to_pdf.py 2>/dev/null || python3 html_to_pdf.py; \
	elif command -v puppeteer >/dev/null 2>&1 && [ -f html-to-pdf.js ]; then \
		node html-to-pdf.js; \
	elif command -v wkhtmltopdf >/dev/null 2>&1; then \
		wkhtmltopdf --enable-local-file-access --print-media-type \
		--margin-top 15mm --margin-bottom 15mm --margin-left 15mm --margin-right 15mm \
		output/cv-michael-borck.html output/cv-michael-borck.pdf && \
		echo "PDF CV generated: output/cv-michael-borck.pdf"; \
	elif command -v weasyprint >/dev/null 2>&1; then \
		weasyprint output/cv-michael-borck.html output/cv-michael-borck.pdf && \
		echo "PDF CV generated: output/cv-michael-borck.pdf"; \
	else \
		echo "No PDF converter found. Install one of:"; \
		echo "  - Playwright: pipx install playwright && playwright install chromium"; \
		echo "  - Puppeteer: npm install puppeteer"; \
		echo "  - wkhtmltopdf: sudo apt-get install wkhtmltopdf"; \
		echo "  - WeasyPrint: pipx install weasyprint"; \
		echo "Or open output/cv-michael-borck.html in a browser and print to PDF (Ctrl+P)"; \
	fi

# Generate HTML version
html:
	@echo "Generating HTML CV..."
	@mkdir -p output
	@cd src && quarto render cv-template-python.qmd --to html --output cv-michael-borck.html
	@test -f output/src/cv-michael-borck.html && mv output/src/cv-michael-borck.html output/ || true
	@test -d output/src/cv-michael-borck_files && mv output/src/cv-michael-borck_files output/ || true
	@test -d output/src && rm -rf output/src || true
	@echo "HTML CV generated: output/cv-michael-borck.html"

# Generate Reveal.js slides
slides:
	@echo "Generating Reveal.js presentation..."
	@mkdir -p output
	@cd src && quarto render cv-template-python.qmd --to revealjs --output cv-michael-borck-slides.html
	@test -f output/src/cv-michael-borck-slides.html && mv output/src/cv-michael-borck-slides.html output/ || true
	@test -d output/src/cv-michael-borck-slides_files && mv output/src/cv-michael-borck-slides_files output/ || true
	@test -d output/src && rm -rf output/src || true
	@echo "Reveal.js presentation generated: output/cv-michael-borck-slides.html"


# Generate CV Quest - Standalone Swipe Card Adventure Game
quest:
	@echo "Generating CV Quest - Standalone Version..."
	@python3 scripts/generate_cv_cards.py
	@echo "CV Quest Standalone ready: creative/quest/index.html"
	@echo "  - Open creative/quest/index.html in a browser to play"
	@echo "  - Or serve with: cd creative/quest && python3 -m http.server 8000"

# Generate Terminal CV - Standalone Zork-like Text Adventure
terminal:
	@echo "Generating Terminal CV - Standalone Version..."
	@python3 scripts/generate_terminal_data.py
	@echo "Terminal CV Standalone ready: creative/terminal/index.html"
	@echo "  - Open creative/terminal/index.html in a browser to play"
	@echo "  - Or serve with: cd creative/terminal && python3 -m http.server 8001"

# Generate Magazine CV - Standalone Professional Publication
magazine:
	@echo "Generating Magazine CV - Standalone Version..."
	@python3 scripts/generate_magazine_data.py
	@echo "Magazine CV Standalone ready: creative/magazine/index.html"
	@echo "  - Open creative/magazine/index.html in a browser to view"
	@echo "  - Or serve with: cd creative/magazine && python3 -m http.server 8002"

# Generate API CV - Swagger-style Documentation Interface  
api:
	@echo "Generating API CV - Standalone Version..."
	@python3 scripts/generate_api_data.py
	@echo "API CV Standalone ready: creative/api/index.html"
	@echo "  - Open creative/api/index.html in a browser to view"
	@echo "  - Or serve with: cd creative/api && python3 -m http.server 8003"

# Generate Chatbot CV - Conversational Interface
chatbot:
	@echo "Generating Chatbot CV - Standalone Version..."
	@python3 scripts/generate_chatbot_data.py
	@echo "Chatbot CV Standalone ready: creative/chatbot/index.html"
	@echo "  - Open creative/chatbot/index.html in a browser to view"
	@echo "  - Or serve with: cd creative/chatbot && python3 -m http.server 8004"

# Watch for changes and auto-rebuild
watch:
	@echo "Watching for changes (HTML output)..."
	@cd src && quarto preview cv-template-python.qmd --to html --no-browser

# Serve the HTML version locally
serve:
	@echo "Serving HTML CV at http://localhost:8008"
	@cd output && python3 -m http.server 8008 || python -m SimpleHTTPServer 8008

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
	@$${EDITOR:-nano} data/cv-data.yml

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
	@echo "  make all        - Generate all output formats (PDF, HTML, Reveal.js)"
	@echo "  make pdf        - Generate PDF from HTML (uses Playwright/wkhtmltopdf/weasyprint)"
	@echo "  make pdf-latex  - Generate PDF via LaTeX (traditional method)"
	@echo "  make html       - Generate HTML version only"
	@echo "  make slides     - Generate Reveal.js presentation only"
	@echo "  make quest      - Generate CV Quest - standalone swipe card adventure game"
	@echo "  make terminal   - Generate Terminal CV - standalone Zork-like text adventure"
	@echo "  make magazine   - Generate Magazine CV - standalone professional publication"
	@echo "  make api        - Generate API CV - Swagger-style documentation interface"
	@echo "  make chatbot    - Generate Chatbot CV - conversational interface"
	@echo "  make watch      - Watch for changes and auto-rebuild HTML"
	@echo "  make serve      - Serve HTML version locally on port 8008"
	@echo "  make clean      - Remove all generated files"
	@echo "  make validate   - Check if cv-data.yml is valid"
	@echo "  make edit       - Open cv-data.yml in your default editor"
	@echo "  make preview    - Generate all formats and open in browser"
	@echo "  make install    - Install required R packages (for R template)"
	@echo "  make commit     - Commit all changes to git"
	@echo "  make push       - Commit and push to remote repository"
	@echo "  make help       - Show this help message"
	@echo ""
	@echo "PDF Generation Options:"
	@echo "  - make pdf uses HTML-to-PDF conversion (modern, better fonts)"
	@echo "  - make pdf-latex uses traditional LaTeX (if you prefer)"
	@echo "  - For best results, install: pipx install playwright && playwright install chromium"
	@echo ""
	@echo "Quick Start:"
	@echo "  1. Edit your CV data: make edit"
	@echo "  2. Generate all formats: make all"
	@echo "  3. Preview the output: make preview"
	@echo ""
	@echo "For continuous development:"
	@echo "  make watch  (in one terminal)"
	@echo "  make serve  (in another terminal)"
