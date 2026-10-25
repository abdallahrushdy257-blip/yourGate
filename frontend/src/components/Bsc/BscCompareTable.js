// src/components/Bsc/BscCompareTable.jsx

const BscCompareTable = ({ orgs }) => {
  if (!orgs?.length) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-semibold text-gray-800">مقارنة الجمعيات</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="text-right px-4 py-3 font-medium">#</th>
              <th className="text-right px-4 py-3 font-medium">الجمعية</th>
              <th className="text-center px-4 py-3 font-medium">المالية</th>
              <th className="text-center px-4 py-3 font-medium">العمليات</th>
              <th className="text-center px-4 py-3 font-medium">المستفيدون</th>
              <th className="text-center px-4 py-3 font-medium">النمو</th>
              <th className="text-center px-4 py-3 font-medium">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orgs.map((org, idx) => {
              const p = org.perspectives ?? {};
              const scores = [
                p.finance?.score,
                p.internal?.score,
                p.clients?.score,
                p.growth?.score,
              ].filter(s => s !== null && s !== undefined);

              const overall = scores.length
                ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
                : null;

              const badge = (score) => {
                if (score === null || score === undefined)
                  return <span className="text-gray-300">—</span>;
                const color =
                  score >= 75 ? 'text-green-600 bg-green-50' :
                  score >= 50 ? 'text-yellow-600 bg-yellow-50' :
                                'text-red-500 bg-red-50';
                return (
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${color}`}>
                    {score}%
                  </span>
                );
              };

              return (
                <tr key={org.org_id}
                    className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {org.org_name}
                  </td>
                  <td className="px-4 py-3 text-center">{badge(p.finance?.score)}</td>
                  <td className="px-4 py-3 text-center">{badge(p.internal?.score)}</td>
                  <td className="px-4 py-3 text-center">{badge(p.clients?.score)}</td>
                  <td className="px-4 py-3 text-center">{badge(p.growth?.score)}</td>
                  <td className="px-4 py-3 text-center font-bold">
                    {badge(overall)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BscCompareTable;