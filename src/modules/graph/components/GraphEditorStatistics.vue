<template>
  <div id="statistics"></div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'GraphEditorStatistics',
  data() {
    return {
      container: null,
      chart: null
    }
  },
  computed: {
    ...mapGetters(['graphNodes', 'graphBoardColorMapper']),
    statisticsData() {
      const { graphNodes, graphBoardColorMapper } = this
      const dataMapper = {}
      graphNodes.forEach(({ group }) => {
        if (!Reflect.has(dataMapper, group)) {
          dataMapper[group] = 1
        } else {
          dataMapper[group]++
        }
      })
      const data = Reflect.ownKeys(dataMapper).map(group => ({
        name: group,
        value: dataMapper[group],
        itemStyle: {
          color: graphBoardColorMapper[group]
        }
      }))
      data.sort(({ name: x }, { name: y }) => (x < y ? -1 : x === y ? 0 : 1))
      return data
    }
  },
  watch: {
    graphNodes() {
      this.draw()
    }
  },
  methods: {
    draw() {
      const option = {
        title: {
          text: '实体类型统计',
          subtext: '各类实体总数',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          top: 'bottom'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: true },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '实体类型',
            type: 'pie',
            radius: [15, 90],
            center: ['50%', '50%'],
            roseType: 'area',
            itemStyle: {
              borderRadius: 8
            },
            data: this.statisticsData
          }
        ]
      }
      this.chart.setOption(option)
    }
  },
  mounted() {
    const container = document.querySelector('#statistics')
    const chart = this.$echarts.init(container)
    this.container = container
    this.chart = chart

    this.draw()
  }
}
</script>

<style scoped>
#statistics {
  width: 300px;
  height: 400px;
}
</style>
