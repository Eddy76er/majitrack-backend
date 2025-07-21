# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies with legacy-peer-deps (to fix cloudinary v2 conflict)
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Expose port (Docker doesn't read .env, so EXPOSE is informational only)
EXPOSE 5000

# Start the app
CMD ["npm", "start"]

