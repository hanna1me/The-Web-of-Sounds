import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const TOOLTIP_STYLE = {
  backgroundColor: "#400074",
  border: "none",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "14px",
  fontFamily: "Inter, system-ui, sans-serif",
  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
};

export function GenreDistribution({ pieData = [] }) {
  const safePieData = Array.isArray(pieData) ? pieData : [];
  const hasData = safePieData.length > 0;

  return (
    <div className="glass card-hover p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: "#400074" }}
        />
        <h3 className="text-base font-semibold" style={{ color: "#000000" }}>Genre Distribution</h3>
      </div>

      {hasData ? (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={safePieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              paddingAngle={2}
              label={({ name, percent }) => (percent > 0.05 ? name : "")}
              labelLine={false}
            >
              {safePieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} opacity={0.85} />
              ))}
            </Pie>
            <Tooltip contentStyle={TOOLTIP_STYLE} formatter={(value, name) => [value, name]} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-sm" style={{ color: "#9ca3af" }}>
          Select an artist to see genre distribution
        </div>
      )}
    </div>
  );
}
