<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import router from '../router/router'
import { useGlobalStore } from '../stores/global';
import { useAPIStore } from '../stores/api';
import { UserStats } from '../types/UserStats';
import icon from '/favicon.ico'
const globalStore = useGlobalStore()
const APIStore = useAPIStore()
const monthlyPoops = ref([])

const treemapOpts = {
    chart: {
        type: 'treemap'
    }
}

const treemapSeries = ref([])
let areaOpts = ref({})
let areaSeries = ref([])

function groupByUser(data)
{
    const grouped = {};
    data.forEach(item =>
    {
        const user = item.username
        if (!grouped[user])
        {
            grouped[user] = 0;
        }
        grouped[user]++;
    })
    return grouped;
}

function groupByDay(data)
{
    const grouped = {};
    data.forEach(item =>
    {
        const date = new Date(item.timestamp);
        const day = date.toISOString().split('T')[0];
        if (!grouped[day])
        {
            grouped[day] = 0;
        }
        grouped[day]++;
    });
    return grouped;
}

function fillMissingDays(grouped)
{
    const startDate = new Date(globalStore.selectedDate.getFullYear(), globalStore.selectedDate.getMonth(), 2);
    const endDate = new Date(globalStore.selectedDate.getFullYear(), globalStore.selectedDate.getMonth() + 1, 1);
    const filled = {}
    let currentDate = new Date(startDate);
    while (currentDate <= endDate)
    {
        const day = currentDate.toISOString().split('T')[0];
        filled[day] = grouped[day] || 0;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return filled;
}

onMounted(async () =>
{
    const date = new Date(globalStore.selectedDate.getFullYear(), globalStore.selectedDate.getMonth() + 1)
    monthlyPoops.value = await (await APIStore.client.getMonthlyPoops(date)).json()
    const filledData = fillMissingDays(groupByDay(monthlyPoops.value));

    const groupedByDay = Object.keys(filledData).map(date => ({
        date,
        count: filledData[date]
    }))

    areaOpts.value = {
        chart: {
            type: 'area',
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            type: 'date',
            categories: groupedByDay.map(x => x.date)
        }
    }

    areaSeries.value = [{
        name: 'poop',
        data: groupedByDay.map(x => x.count)
    }]


    const groupedByUser = groupByUser(monthlyPoops.value)

    treemapSeries.value = [{
        name: 'poop',
        data: Object.entries(groupedByUser).map(
            obj => ({ x: obj[0], y: obj[1] })
        )
    }]

})

</script>

<template>
    <div class="stats-wrapper">
        <h1>CACCA STATS</h1>
        <h2>{{ globalStore.displayDate }}</h2>
        <div class="stats-wrapper">

            <!-- <div class="stats w-96 shadow m-2">

                <div class="stat bg-base-200 text-center">
                    <div class="stat-title">Total Monthly Poops</div>
                    <div class="stat-value">{{ monthlyPoops.length }}</div>
                    <div class="stat-desc">{{ globalStore.displayDate }}</div>
                </div>

            </div>

            <div class="stats w-96 shadow m-2">

                <div class="stat bg-base-200 text-center">
                    <div class="stat-title">Total Monthly Poops</div>
                    <div class="stat-value">{{ monthlyPoops.length }}</div>
                    <div class="stat-desc">{{ globalStore.displayDate }}</div>
                </div>

            </div>

            <div class="stats w-96 shadow m-2">

                <div class="stat bg-base-200 text-center">
                    <div class="stat-title">Total Monthly Poops</div>
                    <div class="stat-value">{{ monthlyPoops.length }}</div>
                    <div class="stat-desc">{{ globalStore.displayDate }}</div>
                </div>

            </div>

            <div class="stats w-96 shadow m-2">

                <div class="stat bg-base-200 text-center">
                    <div class="stat-title">Total Monthly Poops</div>
                    <div class="stat-value">{{ monthlyPoops.length }}</div>
                    <div class="stat-desc">{{ globalStore.displayDate }}</div>
                </div>

            </div> -->
        </div>

        <div class="charts-wrapper m-2">
            <div id="chart">
                <h2>Poop distribution</h2>
                <apexchart height="400px" type="treemap" :options="treemapOpts" :series="treemapSeries"></apexchart>
            </div>


            <div id="chart">
                <h2>Poops per day</h2>
                <apexchart height="400px" type="area" :options="areaOpts" :series="areaSeries"></apexchart>
            </div>
        </div>
    </div>
</template>

<style scoped>
.stats-wrapper {
    margin: auto;
    text-align: center;
}

h1 {
    font-weight: bold;
    font-size: 2rem;
}

h2 {
    font-weight: bold;
    font-size: 1.6rem;
}
</style>
