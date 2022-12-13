import CLoading from 'common/components/CLoading'
import React from 'react'
import { Bar } from 'react-chartjs-2'

import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Colors,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, Colors)

export const options = {
    responsive: true,
    layout: {
        padding: { top: 50, bottom: 0, left: 50, right: 50 },
    },
    interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false,
    },
    scales: {
        y: {
            ticks: {
                font: {
                    size: 14,
                },
                color: 'black',
                beginAtZero: true,
                callback: function (value) {
                    if (value % 1 === 0) {
                        return value
                    }
                },
            },
            value: {},
        },
        x: {
            ticks: {
                font: {
                    size: 14,
                },
                color: 'black',
            },
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            enabled: true,
            intersect: false,
        },
        title: {
            display: false,
        },
    },
}

function MSlide({ slideData, isSlideDataLoading }) {
    return isSlideDataLoading ? (
        <CLoading />
    ) : (
        <>
            <h2 className="p-3 text-3xl">{slideData.question}</h2>
            <Bar options={options} data={slideData?.data} />
        </>
    )
}

export default MSlide
