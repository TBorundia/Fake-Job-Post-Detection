# Use Node.js image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and lock file first (for better caching)
COPY package*.json ./

# Force Rollup to skip native binary checks
ENV ROLLUP_SKIP_NODE_PLATFORM_CHECK=true

# Install dependencies
RUN npm install --force

# Copy the rest of the frontend code
COPY . .

# Expose Vite default dev port
EXPOSE 5173

# Start Vite development server with host binding for Docker
CMD ["npm", "run", "dev", "--", "--host"]
