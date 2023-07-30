import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Graph2 = ({ categoryTotals, categoryLimits }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        drawChart();
    }, [categoryTotals, categoryLimits]);

    const drawChart = () => {
        const ctx = canvasRef.current.getContext('2d');

        const data = {
            labels: Object.keys(categoryTotals),
            datasets: [
                {
                    label: 'Total Expense',
                    data: Object.values(categoryTotals),
                    backgroundColor: '#AEC8C7',
                    borderWidth: 1,
                },
            ],
        };

        const options = {
            scales: {
                y: {
                    beginAtZero: true,
                },
            },
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                drawLimits: {
                    categoryLimits: categoryLimits,
                    color: 'red',
                    lineWidth: 1,
                    lineDash: [4, 4], // Optional: To make the line dashed
                },
            },
        };

        if (categoryLimits) {
            Chart.register(
                {
                    id: 'drawLimits',
                    beforeDraw(chart) {
                        const drawLimitsPlugin = chart.config.options.plugins.drawLimits;
                        const ctx = chart.ctx;
                        const xAxis = chart.scales.x;
                        const yAxis = chart.scales.y;

                        ctx.save();
                        ctx.strokeStyle = drawLimitsPlugin.color;
                        ctx.lineWidth = drawLimitsPlugin.lineWidth;
                        ctx.setLineDash(drawLimitsPlugin.lineDash);

                        drawLimitsPlugin.categoryLimits.forEach((limit, index) => {
                            const pixelPosition = xAxis.getPixelForValue(index);
                            ctx.beginPath();
                            ctx.moveTo(pixelPosition, yAxis.getPixelForValue(limit));
                            ctx.lineTo(pixelPosition + xAxis.getPixelForValue(1) - pixelPosition, yAxis.getPixelForValue(limit));
                            ctx.stroke();
                        });

                        ctx.restore();
                    },
                },
                'bar',
                'drawLimits'
            );
        }

        new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options,
        });
    };

    return
    categoryTotals ? (<canvas ref={canvasRef} width="400" height="200"></canvas>)
        : (<div className='Lists' style={{ height: "60vh" }}>No Suitable Expense data found</div>);
};

export default Graph2;
