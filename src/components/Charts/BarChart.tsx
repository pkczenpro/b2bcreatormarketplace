import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

export function BarChartComponent({ campaignAnalytics }) {
    if (!campaignAnalytics || !Array.isArray(campaignAnalytics) || campaignAnalytics.length === 0) {
        return <div className="text-sm text-gray-500 italic">No campaign data available.</div>;
    }
    // Convert raw data into chart-friendly format
    const dataKeys = campaignAnalytics.reduce((acc, curr) => {
        Object.keys(curr).forEach((key) => {
            if (key !== "label") acc.add(key);
        });
        return acc;
    }, new Set());

    const chartConfig = {};
    Array.from(dataKeys).forEach((key, index) => {
        const colors = ["#60a5fa", "#34d399", "#f87171", "#facc15"];
        chartConfig[key] = {
            label: key.charAt(0).toUpperCase() + key.slice(1),
            color: colors[index % colors.length],
        };
    });

    return (
        <ChartContainer
            config={chartConfig}
            className="min-h-[220px] w-full bg-white rounded-2xl p-4"
        >
            <BarChart data={campaignAnalytics}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                    dataKey="label"
                    tickLine={false}
                    tickMargin={12}
                    axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                {Object.keys(chartConfig).map((key) => (
                    <Bar
                        key={key}
                        dataKey={key}
                        fill={chartConfig[key].color}
                        radius={[8, 8, 0, 0]}
                    />
                ))}
            </BarChart>
        </ChartContainer>
    );
}
