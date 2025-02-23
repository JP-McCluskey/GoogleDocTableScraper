# Google Docs Table Scraper & Visualizer

This was a project created for DataAnnotation platform's online assessment.

A React application that scrapes tables from Google Docs and visualizes the data in both tabular and coordinate plane formats.

<img width="876" alt="Screenshot 2025-02-23 at 4 36 39 PM" src="https://github.com/user-attachments/assets/c8c1ab83-9670-43e6-b4d2-5a7b26132f41" />
<img width="814" alt="Screenshot 2025-02-23 at 3 13 21 PM" src="https://github.com/user-attachments/assets/c9ee3384-6c3b-4cc0-a006-424716d3c7e9" />

## Features

- Extract tables from public Google Docs
- Display data in a clean, responsive table format
- Visualize coordinate data on a grid


## Prerequisites

- Node.js 18.0 or higher
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd google-docs-scraper
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

1. Make your Google Doc public by:
   - Click "Share" in Google Docs
   - Change access to "Anyone with the link"
   - Copy the URL

   The test links given are:
   - https://docs.google.com/document/d/e/2PACX-1vQGUck9HIFCyezsrBSnmENk5ieJuYwpt7YHYEzeNJkIb9OSDdx-ov2nRNReKQyey-cwJOoEKUhLmN9z/pub
   - https://docs.google.com/document/d/e/2PACX-1vRMx5YQlZNa3ra8dYYxmv-QIQ3YJe8tbI3kqcuC7lQiZm-CSEznKfN_HYNSpoXcZIV3Y_O3YoUB1ecq/pub

3. Paste the Google Docs URL into the input field

4. Click "Extract Table" to fetch and display the data

### Table Format Requirements

The table in your Google Doc should follow this format:
- First column: X-coordinate (number)
- Second column: Character to display (string)
- Third column: Y-coordinate (number)

Example table:
| X | Char | Y |
|---|------|---|
| 0 | A    | 0 |
| 1 | B    | 1 |
| 2 | C    | 2 |


### Built With
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Lucide React Icons

### Key Components

- `extractDocId`: Parses Google Docs URLs to extract document IDs
- `scrapeGoogleDoc`: Fetches and parses table data from Google Docs
- `createCoordinatePlane`: Renders the coordinate visualization
- Coordinate plane visualization with [0,0] at bottom-left

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## License

MIT License - feel free to use this project for your own purposes.
