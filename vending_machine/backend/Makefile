.PHONY: all build run clean

# Default target
all: build

# Build the project
build:
	@echo "Building vending machine backend..."
	@mkdir -p build
	@cd build && cmake ..
	@cd build && $(MAKE)

# Run the server
run: build
	@echo "Starting vending machine server..."
	@cd build && ./vending_machine_server

# Clean build files
clean:
	@echo "Cleaning build files..."
	@rm -rf build

# Help target
help:
	@echo "Available targets:"
	@echo "  make build    - Build the project"
	@echo "  make run      - Build and run the server"
	@echo "  make clean    - Clean build files"
	@echo "  make help     - Show this help message" 