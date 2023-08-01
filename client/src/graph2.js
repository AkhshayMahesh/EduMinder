import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const Graph2 = ({ categoryTotals, categoryLimits }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const graph = drawChart();
        return () => {
            graph.destroy();
        }
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
                {
                    label: 'Limit',
                    data: Object.values(categoryLimits),
                    borderColor: '#AEC8C7',
                    borderWidth: 2,
                },
            ],
        };

        const options = {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Categories',
                        color: '#AEC8C7',

                    },
                    ticks: {
                        color: '#AEC8C7'
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Amount',
                        color: '#AEC8C7'
                    },
                    ticks: {
                        color: '#AEC8C7',
                        beginAtZero: true,
                    },
                }
            },
            maintainAspectRatio: false,
            responsive: true,
            // plugins: {
            //     drawLimits: {
            //         categoryLimits: categoryLimits,
            //         color: 'red',
            //         lineWidth: 1,
            //         lineDash: [4, 4], // Optional: To make the line dashed
            //     },
            // },
        };

        return new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options,
        });
    };

    return (
        categoryTotals ? (<div className='Lists' style={{ alignItems: "unset", height: "90%" }}>
            <canvas ref={canvasRef} width="200" height="60"></canvas></div>)
            : (<div className='Lists' style={{ height: "60vh" }}>No Suitable Expense data found</div>));
};

export default Graph2;
