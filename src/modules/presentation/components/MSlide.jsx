import React from 'react'

import CLoading from 'common/components/CLoading'

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

function MSlide({ currentSlide, slideData, isSlideDataLoading }) {
    return isSlideDataLoading ? (
        <CLoading />
    ) : currentSlide?.type === 3 ? (
        <>
            <h2 className="p-3 text-3xl">{slideData.question}</h2>
            <Bar options={options} data={slideData?.data} />
        </>
    ) : currentSlide?.type === 2 ? (
        <div className="flex h-full animate-[show-slow_0.5s_ease-in] flex-col items-center justify-center ">
            <h1 className="mb-10 px-40 text-center text-2xl">{currentSlide?.paragraph}</h1>
        </div>
    ) : currentSlide?.type === 1 ? (
        <div className="flex h-full animate-[show-slow_0.5s_ease-in] flex-col items-center justify-center">
            <h1 className="mb-16 w-[70rem] text-center text-5xl">{currentSlide?.heading}</h1>
            <h2 className="w-[70rem] text-center text-2xl">{currentSlide?.subheading}</h2>
        </div>
    ) : null
}

export default MSlide
