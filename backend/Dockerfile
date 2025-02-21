# Stage 1: Build the application
FROM node:16 AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY . .

# Install dependencies
RUN npm install

# Copy the rest of the application code


# Stage 2: Create the final lightweight image
FROM node:16-alpine

WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app /app

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "index.js"]


