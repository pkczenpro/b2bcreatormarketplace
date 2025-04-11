import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartConfig = {
    desktop: {
        label: "Pending Creators",
        color: "#2563eb",
    },
    mobile: {
        label: "Active Creators",
        color: "#60a5fa",
    },
}

export function BarChartComponent({
    campaignAnalytics,
}) {

    if (!campaignAnalytics || !campaignAnalytics.campaign) {
        return <div>No data available</div>
    }
    // Prepare the data for the chart based on creator statuses
    const pendingCreators = campaignAnalytics.campaign.selectedCreators.filter(
        (creator) => creator.status === "pending"
    ).length;

    const activeCreators = campaignAnalytics.campaign.selectedCreators.filter(
        (creator) => creator.status === "active"
    ).length;

    const chartData = [
        { month: "", desktop: pendingCreators, mobile: activeCreators }
    ];

    return (
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
            </BarChart>
        </ChartContainer>
    );
}
