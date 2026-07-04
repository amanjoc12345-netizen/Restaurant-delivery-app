import React from 'react';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';

const DataTable = ({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No records found',
  emptySubMessage = 'Try adding a new item or adjusting your search parameters.',
  keyField = 'id',
}) => {
  if (loading) {
    return <LoadingSkeleton type="table" rows={5} cols={columns.length} />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        title={emptyMessage}
        description={emptySubMessage}
      />
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-850 bg-slate-900 shadow-xl">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-850 bg-slate-950/40 text-[10px] uppercase font-bold text-slate-500 tracking-wider select-none">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-4 px-6 ${col.className || ''}`}
                style={col.style}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-850 text-sm">
          {data.map((item, rowIdx) => (
            <tr
              key={item[keyField] || rowIdx}
              className="hover:bg-slate-950/20 transition-colors text-slate-350"
            >
              {columns.map((col, colIdx) => (
                <td
                  key={colIdx}
                  className={`py-4 px-6 ${col.cellClassName || ''}`}
                  style={col.cellStyle}
                >
                  {col.render ? col.render(item, rowIdx) : item[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
