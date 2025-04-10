# Use the official Playwright image with all deps installed
FROM mcr.microsoft.com/playwright/python:v1.41.2-jammy

# Set working directory
WORKDIR /app

# Copy all project files
COPY . .

# Install Python dependencies
RUN pip install --upgrade pip && pip install -r requirements.txt

# Install playwright browsers (they're already cached)
RUN playwright install

# Expose port Flask will run on
EXPOSE 10000

# Run your Flask app
CMD ["python", "run.py"]
