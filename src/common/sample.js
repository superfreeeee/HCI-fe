export const fakeGraphData = {
  nodes: [
    { nodeId: 8, name: '小智', group: '人物', val: 1 },
    { nodeId: 9, name: 'cyz', group: '人物', val: 5 },
    { nodeId: 68, name: '皮卡丘', group: '宠物', val: 3 },
    { nodeId: 69, name: '小智', group: '人物', val: 1 },
    { nodeId: 6, name: '皮卡丘', group: '宠物', val: 3 },
    { nodeId: 7, name: '杰尼龟', group: '宠物', val: 2 }
  ],
  relations: [
    { relationId: 3, name: '主人', source: 8, target: 6, val: 1 },
    { relationId: 2, name: '主人', source: 9, target: 6, val: 5 },
    { relationId: 11, name: '主人', source: 8, target: 6, val: 1 },
    { relationId: 10, name: '主人', source: 9, target: 6, val: 5 },
    { relationId: 5, name: '朋友', source: 6, target: 7, val: 1 },
    { relationId: 4, name: '主人', source: 8, target: 7, val: 1 },
    { relationId: 13, name: '朋友', source: 6, target: 7, val: 1 },
    { relationId: 12, name: '主人', source: 8, target: 7, val: 1 }
  ]
}

export const fakeProjectInfo = {
  projectId: 1,
  name: '知识图谱1',
  description: '这是第一个知识图谱',
  userId: 1,
  xml: null
}

// base on: /project/listByUserId/{userId}  根据用户搜索知识图谱项目列表
export const fakeProjects = [
  {
    description: 'string',
    name: 'string',
    projectId: 1,
    userId: 0,
    xml: 'string'
  },
  {
    description: 'string',
    name: 'string',
    projectId: 2,
    userId: 0,
    xml: 'string'
  },
  {
    description: 'string',
    name: 'string',
    projectId: 3,
    userId: 0,
    xml: 'string'
  }
]

export const fakeXml = `
<project>
  <nodes>
    <node>
      <name>小智</name>
      <group>1</group>
      <val>6</val>
    </node>
    <node>
      <name>杰尼龟</name>
      <group>2</group>
      <val>2</val>
    </node>
    <node>
      <name>皮卡丘</name>
      <group>2</group>
      <val>4</val>
    </node>
    <node>
      <name>陈彦泽</name>
      <group>1</group>
      <val>4</val>
    </node>
  </nodes>
  <relations>
    <relation>
      <name>主人</name>
      <source>1</source>
      <target>2</target>
      <val>2</val>
    </relation>
    <relation>
      <name>主人</name>
      <source>1</source>
      <target>3</target>
      <val>2</val>
    </relation>
    <relation>
      <name>主人</name>
      <source>2</source>
      <target>4</target>
      <val>4</val>
    </relation>
    <relation>
      <name>朋友</name>
      <source>2</source>
      <target>3</target>
      <val>5</val>
    </relation>
  </relations>
</project>
`
