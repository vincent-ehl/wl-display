#!/bin/bash

url="http://localhost:3000"
max_attempts=30
delay_seconds=5

# Function to check if the URL is accessible
is_url_available() {
    if curl --output /dev/null --silent --head --fail "$1"; then
        return 0
    else
        return 1
    fi
}

# Loop to check URL availability
for ((i=1; i<=$max_attempts; i++)); do
    echo "Checking URL availability (Attempt $i)..."
    if is_url_available "$url"; then
        echo "URL is available. Opening in Chromium..."
        chromium-browser "$url" --start-fullscreen
        exit 0
    else
        echo "URL is not available. Waiting for $delay_seconds seconds before trying again..."
        sleep "$delay_seconds"
    fi
done

echo "URL could not be reached after $max_attempts attempts. Exiting."
