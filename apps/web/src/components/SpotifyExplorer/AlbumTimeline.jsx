import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const TOOLTIP_STYLE = {
  backgroundColor: "#400074",
  border: "none",
  borderRadius: "10px",
  color: "#ffffff",
  fontSize: "14px",
  fontFamily: "Inter, system-ui, sans-serif",
  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
};

export function AlbumTimeline({ chartData }) {
  return (
    <div className="glass card-hover p-6 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div
          className="w-1 h-5 rounded-full"
          style={{ background: "#400074" }}
        />
        <h3 className="text-base font-semibold" style={{
            color: "#000000",
            fontFamily:
              'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}># of Albums Released</h3>
      </div>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barSize={14} style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.07)" vertical={false} />
            <XAxis
              dataKey="year"
              tick={{ fill: "#9ca3af", fontSize: 14, fontFamily: "Inter, system-ui, sans-serif" }}
              axisLine={{ stroke: "rgba(0,0,0,0.08)" }}
              tickLine={false}
            />
            <YAxis
              dataKey="albums"
              tick={{ fill: "#9ca3af", fontSize: 14, fontFamily: "Inter, system-ui, sans-serif" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(64,0,116,0.05)" }}
              contentStyle={TOOLTIP_STYLE}
            />
            <Bar
              dataKey="albums"
              fill="#1DB954"
              radius={[4, 4, 0, 0]}
              activeBar={{ fill: "#17a34a" }}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[280px] flex items-center justify-center text-sm"
        style={{
            color: "#9ca3af",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
          >
          Select an artist to see album timeline
        </div>
      )}
    </div>
  );
}
