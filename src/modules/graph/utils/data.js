export const _projectInfo = {
  projectId: 3,
  name: '国家知识图谱',
  description: '用于测试布局 迭代一、二',
  userId: 1,
  layoutStatus: null
}

export const _graphData = {
  projectId: 3,
  nodes: [
    {
      id: 4,
      name: '日本',
      group: '地理实体',
      radius: 5,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 5,
      name: '9634057km^2',
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '15',
      figure: 'circle',
      properties: {}
    },
    {
      id: 6,
      name: '13.54亿',
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 7,
      name: '北京',
      group: '城市',
      radius: 5,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 11,
      name: "116°20'E",
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 14,
      name: '1.26亿',
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 8,
      name: '16410km^2',
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 16,
      name: '35°44’N',
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 10,
      name: "38°56'N",
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 15,
      name: '140°50‘W',
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 12,
      name: '西雅图',
      group: '城市',
      radius: 5,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 13,
      name: '东京111',
      group: '城市',
      radius: 10,
      color: '#a22525',
      textSize: '30',
      figure: 'circle',
      properties: {}
    },
    {
      id: 2,
      name: '中国',
      group: '地理实体',
      radius: 7,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 9,
      name: '2069.3万',
      group: '属性值',
      radius: 3,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    },
    {
      id: 3,
      name: '美国',
      group: '地理实体',
      radius: 7,
      color: '',
      textSize: '20',
      figure: 'circle',
      properties: {}
    }
  ],
  links: [
    {
      name: '面积',
      id: 6,
      source: 2,
      target: 5,
      value: 1,
      from: 2,
      to: 5
    },
    {
      name: '人口',
      id: 5,
      source: 2,
      target: 6,
      value: 1,
      from: 2,
      to: 6
    },
    {
      name: '首都',
      id: 7,
      source: 2,
      target: 7,
      value: 1,
      from: 2,
      to: 7
    },
    {
      name: '经度',
      id: 9,
      source: 7,
      target: 11,
      value: 1,
      from: 7,
      to: 11
    },
    {
      name: '人口',
      id: 13,
      source: 4,
      target: 14,
      value: 1,
      from: 4,
      to: 14
    },
    {
      name: '面积',
      id: 4,
      source: 7,
      target: 8,
      value: 1,
      from: 7,
      to: 8
    },
    {
      name: '维度',
      id: 14,
      source: 13,
      target: 16,
      value: 1,
      from: 13,
      to: 16
    },
    {
      name: '维度',
      id: 10,
      source: 7,
      target: 10,
      value: 1,
      from: 7,
      to: 10
    },
    {
      name: '经度',
      id: 15,
      source: 13,
      target: 15,
      value: 1,
      from: 13,
      to: 15
    },
    {
      name: '城市',
      id: 12,
      source: 3,
      target: 12,
      value: 1,
      from: 3,
      to: 12
    },
    {
      name: '首都',
      id: 11,
      source: 4,
      target: 13,
      value: 1,
      from: 4,
      to: 13
    },
    {
      name: '人口',
      id: 8,
      source: 7,
      target: 9,
      value: 1,
      from: 7,
      to: 9
    }
  ],
  layouts: [
    {
      projectId: 3,
      type: 'FORCE',
      width: 20,
      height: 20,
      nodes: []
    },
    {
      projectId: 3,
      type: 'GRID',
      width: 0,
      height: 0,
      nodes: []
    },
    {
      projectId: 3,
      type: 'FIXED',
      width: 0,
      height: 0,
      nodes: []
    }
  ]
}
