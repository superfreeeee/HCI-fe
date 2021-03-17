export const fakeGraphData = {
  projectID: 1,
  nodes: [
    { nodeID: 1, name: '皮卡丘', group: '宠物', val: 1 },
    { nodeID: 2, name: '小智', group: '人物', val: 2 },
    { nodeID: 3, name: '杰尼龟', group: '宠物', val: 3 }
  ],
  relations: [
    {
      relationID: 1,
      name: '主人',
      type: 'TO_FIRST',
      source: 1,
      target: 2,
      val: 1
    },
    {
      relationID: 2,
      name: '朋友',
      type: 'TWO_WAY',
      source: 1,
      target: 3,
      val: 2
    }
  ]
}
