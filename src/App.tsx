import React from 'react';
import { FileSpreadsheet, Grid } from 'lucide-react';

interface Point {
  x: number;
  y: number;
  char: string;
}

function createCoordinatePlane(data: string[][]): JSX.Element {
  // Skip header row and convert data to points
  const points: Point[] = data.slice(1).map(row => ({
    x: parseInt(row[0]) || 0,
    char: row[1] || '',
    y: parseInt(row[2]) || 0
  }));

  // Find grid dimensions
  const maxX = Math.max(...points.map(p => p.x), 0);
  const maxY = Math.max(...points.map(p => p.y), 0);
  
  // Create grid
  const grid: string[][] = Array(maxY + 1).fill(null)
    .map(() => Array(maxX + 1).fill('  '));
  
  // Place characters
  points.forEach(({x, y, char}) => {
    if (x >= 0 && y >= 0 && x <= maxX && y <= maxY) {
      grid[y][x] = char;
    }
  });

  return (
    <div className="font-mono text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
      {[...grid].reverse().map((row, i) => (
        <div key={i} className="flex">
          {row.map((char, j) => (
            <div
              key={j}
              className="w-6 h-6 flex items-center justify-center border border-gray-200"
              style={{
                backgroundColor: char !== ' ' ? '#e5edff' : 'transparent'
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function extractDocId(url: string): string {
  // Handle different Google Docs URL formats
  const patterns = [
    /\/e\/([-\w]{25,})/,
    /id=([-\w]{25,})/,
    /^([-\w]{25,})$/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return '';
}

async function scrapeGoogleDoc(docId: string): Promise<string[][]> {
  try {
    const response = await fetch(`https://docs.google.com/document/d/e/${docId}/pub`);
    const html = await response.text();
    
    // Create a temporary DOM element to parse the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find the first table in the document
    const table = doc.querySelector('table');
    if (!table) throw new Error('No table found in the document');
    
    // Convert table to 2D array
    const rows = Array.from(table.querySelectorAll('tr'));
    return rows.map(row => 
      Array.from(row.querySelectorAll('td')).map(cell => cell.textContent?.trim() || '')
    );
  } catch (error) {
    console.error('Error scraping document:', error);
    throw error;
  }
}

function App() {
  const [url, setUrl] = React.useState('');
  const [tableData, setTableData] = React.useState<string[][]>([]);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTableData([]);
    setLoading(true);

    try {
      const docId = extractDocId(url);
      if (!docId) throw new Error('Invalid Google Docs URL');
      
      const data = await scrapeGoogleDoc(docId);
      setTableData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <FileSpreadsheet className="w-10 h-10 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">Google Docs Table Scraper</h1>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
                Google Docs URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="https://docs.google.com/document/d/..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Scraping...' : 'Extract Table'}
            </button>
          </form>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
              <p className="font-medium">Error</p>
              <p>{error}</p>
            </div>
          )}

          {tableData.length > 0 && (
            <div className="space-y-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tableData.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td
                            key={cellIndex}
                            className={`px-6 py-4 whitespace-nowrap text-sm ${
                              rowIndex === 0 ? 'font-medium text-gray-900' : 'text-gray-500'
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="border-t pt-6">
                <div className="flex items-center mb-4">
                  <Grid className="w-5 h-5 text-indigo-600 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-800">Coordinate Plane Visualization</h2>
                </div>
                {createCoordinatePlane(tableData)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
