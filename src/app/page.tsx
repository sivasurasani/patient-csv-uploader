'use client';

import { useState } from 'react';
import Papa from 'papaparse';

type Patient = {
  [key: string]: string;
};

export default function Home() {
  const [data, setData] = useState<Patient[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv') {
      setError('Please upload a valid CSV file.');
      return;
    }

    Papa.parse<Patient>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsedData = results.data as Patient[];
        const keys = Object.keys(parsedData[0] || {});
        if (keys.length === 0) {
          setError('No columns found in the CSV.');
          return;
        }

        setError(null);
        setColumns(keys);
        setData(parsedData);
      },
      error: () => {
        setError('Error parsing CSV file.');
      },
    });
  };

  const handleCellChange = (rowIndex: number, column: string, value: string) => {
    const updated = [...data];
    updated[rowIndex][column] = value;
    setData(updated);
  };

  return (
    <div className="min-h-screen p-6 bg-white text-gray-900">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Upload Patient CSV</h1>

      <input
        type="file"
        accept=".csv"
        onChange={handleFileUpload}
        className="mb-4 block"
      />

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {data.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 bg-white rounded shadow text-sm text-gray-800">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col) => (
                  <th key={col} className="border p-2 font-semibold text-left">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {columns.map((col) => (
                    <td key={col} className="border p-2">
                      <input
                        type="text"
                        value={row[col] || ''}
                        onChange={(e) =>
                          handleCellChange(rowIndex, col, e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded text-gray-900"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
