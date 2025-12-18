# Smart Expense Tracker

A clean, responsive expense tracking web application built with HTML, CSS, and Vanilla JavaScript. This project is suitable for university mini/major projects.

## Features

### 1. **Expense Management**
- Add expenses with date, description, amount, and category
- Edit existing expenses
- Delete expenses with confirmation
- Input validation to prevent errors

### 2. **Automatic Categorization**
- Smart category detection based on description keywords
- Manual category selection option
- Keyword examples:
  - "pizza", "burger" → Food
  - "uber", "fuel" → Travel
  - "amazon", "flipkart" → Shopping

### 3. **Data Persistence**
- Uses browser LocalStorage to save all data
- Data remains after page reload or browser restart

### 4. **Expense Visualization**
- Interactive pie chart showing category-wise spending
- Chart updates dynamically when data changes
- Built with Chart.js library

### 5. **Filters & Summary**
- Filter expenses by category
- Filter by date range
- Real-time expense summary
- Category-wise spending breakdown
- Highest spending category identification

### 6. **Responsive Design**
- Works on mobile, tablet, and desktop
- Clean, modern UI with intuitive navigation
- No external CSS frameworks used

## Project Structure


## Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with Flexbox, Grid, and CSS variables
- **Vanilla JavaScript**: No frameworks or libraries for core functionality
- **Chart.js**: For data visualization (loaded via CDN)
- **Font Awesome**: Icons (loaded via CDN)
- **Google Fonts**: Typography (Poppins and Roboto)

## How to Run the Project

### Option 1: Direct File Opening
1. Download all project files
2. Open `index.html` directly in any modern web browser
3. No server or build process required

### Option 2: Using a Local Server (Recommended)
1. Install a local server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code
2. Open the project folder in VS Code
3. Right-click `index.html` and select "Open with Live Server"
4. The application will open in your default browser

### Option 3: Using Python Simple HTTP Server
1. Open terminal/command prompt in the project folder
2. Run: `python -m http.server 8000` (Python 3) or `python -m SimpleHTTPServer 8000` (Python 2)
3. Open browser and navigate to: `http://localhost:8000`

## Usage Instructions

### Adding an Expense
1. Fill in the date (defaults to today)
2. Enter a description (e.g., "Dinner at restaurant")
3. Enter the amount
4. Select a category or leave as "Auto-detect"
5. Click "Add Expense"

### Editing an Expense
1. Click the "Edit" button next to any expense in the table
2. Modify the details in the modal that appears
3. Click "Save Changes"

### Deleting an Expense
1. Click the "Delete" button next to any expense
2. Confirm the deletion when prompted

### Filtering Expenses
- Use the category dropdown to filter by specific category
- Use date range inputs to filter by date
- Click "Clear Filters" to remove all filters

### Viewing Summary
- Total expenses are shown at the top
- Category breakdown is displayed in the left panel
- Pie chart visualizes spending distribution

## Code Structure Highlights

### JavaScript (script.js)
- **App Object**: Main application container with all methods and data
- **LocalStorage Integration**: Simple CRUD operations with data persistence
- **Auto-categorization Logic**: Keyword-based category detection
- **Chart Integration**: Dynamic updates with Chart.js
- **Event Handling**: Comprehensive event listeners for all interactions

### CSS (style.css)
- **CSS Variables**: Consistent theming throughout
- **Flexbox & Grid**: Modern layout techniques
- **Responsive Design**: Media queries for all screen sizes
- **Card-based Design**: Clean, organized content sections

### HTML (index.html)
- **Semantic Structure**: Proper use of header, main, section, footer
- **Accessibility**: ARIA labels and proper form labeling
- **Modular Components**: Reusable card-based sections

## Browser Compatibility

The application works on all modern browsers including:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## Data Storage

All expense data is stored locally in the browser's LocalStorage. This means:
- Data is tied to the specific browser and device
- Clearing browser data will delete all expenses
- No data is sent to any external server

## Customization

### Adding New Categories
1. Update the `categories` array in `script.js`
2. Add corresponding color and icon in `categoryColors` and `categoryIcons`
3. Add keywords for auto-categorization in `categoryKeywords`
4. Update the category dropdowns in `index.html`

### Changing Colors
Modify the CSS variables in the `:root` selector in `style.css`:
```css
:root {
    --primary-color: #4361ee;
    --secondary-color: #3a0ca3;
    /* ... other colors */
}