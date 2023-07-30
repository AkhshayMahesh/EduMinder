import React, { useState, useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

const Graph = ({ expenses, credits }) => {
    const [selectedTab, setSelectedTab] = useState();
    const canvasRef = useRef(null);

    useEffect(() => {
        setSelectedTab("week")
    }, [])

    const handleTabChange = (tab) => {
        setSelectedTab(tab);
    };

    const filterData = () => {
        // console.log("inside filter")
        const currentDate = new Date();

        switch (selectedTab) {
            case 'week': {
                const startOfWeekDate = startOfWeek(currentDate, { weekStartsOn: 1 }); // Assuming Monday is the start of the week
                const endOfWeekDate = endOfWeek(currentDate, { weekStartsOn: 1 });

                const filteredExpenses = expenses.filter((expense) => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= startOfWeekDate && expenseDate <= endOfWeekDate;
                });

                const filteredCredits = credits.filter((credit) => {
                    const creditDate = new Date(credit.date);
                    return creditDate >= startOfWeekDate && creditDate <= endOfWeekDate;
                });

                return {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    expenses: calculateDailyTotal(filteredExpenses),
                    credits: calculateDailyTotal(filteredCredits),
                };
            }

            case 'month': {
                const startOfMonthDate = startOfMonth(currentDate);
                const endOfMonthDate = endOfMonth(currentDate);

                const filteredExpenses = expenses.filter((expense) => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= startOfMonthDate && expenseDate <= endOfMonthDate;
                });

                const filteredCredits = credits.filter((credit) => {
                    const creditDate = new Date(credit.date);
                    return creditDate >= startOfMonthDate && creditDate <= endOfMonthDate;
                });

                return {
                    labels: getDaysInMonth(currentDate),
                    expenses: calculateDailyTotal(filteredExpenses),
                    credits: calculateDailyTotal(filteredCredits),
                };
            }

            case 'year': {
                const startOfYearDate = startOfYear(currentDate);
                const endOfYearDate = endOfYear(currentDate);

                const filteredExpenses = expenses.filter((expense) => {
                    const expenseDate = new Date(expense.date);
                    return expenseDate >= startOfYearDate && expenseDate <= endOfYearDate;
                });

                const filteredCredits = credits.filter((credit) => {
                    const creditDate = new Date(credit.date);
                    return creditDate >= startOfYearDate && creditDate <= endOfYearDate;
                });

                return {
                    labels: getMonthsInYear(currentDate),
                    expenses: calculateMonthlyTotal(filteredExpenses),
                    credits: calculateMonthlyTotal(filteredCredits),
                };
            }

            default:
                return {
                    labels: [],
                    expenses: [],
                    credits: [],
                };
        }
    };

    const calculateDailyTotal = (data) => {
        const dailyTotal = new Array(7).fill(0);

        data.forEach((item) => {
            const expenseDate = new Date(item.date);
            const dayOfWeek = expenseDate.getDay();
            dailyTotal[dayOfWeek] += item.amount;
        });

        return dailyTotal;
    };

    const calculateMonthlyTotal = (data) => {
        const monthlyTotal = new Array(12).fill(0);

        data.forEach((item) => {
            const expenseDate = new Date(item.date);
            const monthIndex = expenseDate.getMonth();
            monthlyTotal[monthIndex] += item.amount;
        });

        return monthlyTotal;
    };

    const getDaysInMonth = (date) => {
        const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const daysArray = new Array(daysInMonth).fill(0).map((_, index) => `${index + 1}`);
        return daysArray;
    };

    const getMonthsInYear = (date) => {
        const monthsArray = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthsArray;
    };

    useEffect(() => {
        if (expenses && credits) {
            const lineChart = createLineGraph();
            return () => {
                lineChart.destroy();
            };
        }
    }, [selectedTab]);

    const createLineGraph = () => {
        const ctx = canvasRef.current.getContext('2d');
        const data = filterData();
        const lineChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [
                    {
                        label: 'Expense',
                        borderWidth: "2",
                        borderColor: '#AEC8C7',
                        data: data.expenses,
                    },
                    {
                        label: 'Credit',
                        backgroundColor: '#AEC8C7',
                        data: data.credits,
                    },
                ],
            },
            options: {
                title: {
                    display: true,
                    text: 'Expenses and Credits',
                    color: '#AEC8C7',
                    position: 'top'
                },
                legend: {
                    display: true,
                    position: 'top',
                    align: 'start',
                    labels: {
                        color: '#AEC8C7',
                    },
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time',
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
                    },
                },
                tooltips: {
                    enabled: true,
                    mode: 'nearest',
                },
                gridLines: {
                    display: true,
                    color: 'rgba(174,200,199,0.3)',

                },
            },
        });
        return lineChart;
    };

    return (
        (expenses && credits) ?
            (<div className='Lists' style={{ alignItems: "unset", height: "90%" }}>
                <div className='btn-div'>
                    <button className={`cbtn ${selectedTab == "week" ? "cactive" : ""}`} onClick={() => handleTabChange('week')}>Week</button>
                    <button className={`cbtn ${selectedTab == "month" ? "cactive" : ""}`} onClick={() => handleTabChange('month')}>Month</button>
                    <button className={`cbtn ${selectedTab == "year" ? "cactive" : ""}`} onClick={() => handleTabChange('year')}>Year</button>
                </div>
                <canvas ref={canvasRef} width="250" height="80"></canvas>
            </div>
            ) : (
                <div className='Lists' style={{ height: "60vh" }}>No Suitable Expense data found</div>
            )
    );
};

export default Graph;