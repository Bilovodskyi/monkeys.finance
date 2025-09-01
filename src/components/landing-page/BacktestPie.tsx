import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export const BacktestPie = ({ percentage = 65 }) => {
    const data = [
        { name: "Completed", value: percentage },
        { name: "Remaining", value: 100 - percentage },
    ];

    // Colors: primary depends on percentage; secondary is dark gray (rest of pie)
    const primaryColor = percentage > 0 ? "#4ade80" /* green-400 */ : "#f87171" /* red-400 */;
    const secondaryColor = "#1f2937"; // gray-800
    const COLORS = [primaryColor, secondaryColor];

    return (
        <div className="h-16 w-16 shrink-0 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart >
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        startAngle={90}
                        endAngle={-270}
                        innerRadius={23}
                        outerRadius={28}
                        paddingAngle={0}

                        dataKey="value"
                        strokeWidth={0}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                            />
                        ))}
                    </Pie>
                </PieChart>

            </ResponsiveContainer>

            {/* Icon in the center */}

            {/* Percentage text in the center */}

        </div>
    );
};
