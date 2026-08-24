# Stage 1: Build Stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Build the application
RUN yarn build

# Stage 2: Production Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the built application from the builder stage
COPY --from=builder /app/.output /app

# Expose the port Nuxt runs on
EXPOSE 3000

# Run the application
CMD ["node", "./server/index.mjs"]
