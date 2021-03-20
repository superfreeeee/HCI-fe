export const itemOptions = {
  node: [
    { label: '实体名称', attr: 'name', holder: '实体名称', type: 'input' },
    { label: '实体类别', attr: 'group', holder: '实体类别', type: 'input' },
    { label: '实体权重', attr: 'radius', holder: '1~20', type: 'input' }
  ],
  link: [
    { label: '关系名称', attr: 'name', holder: '关系名称', type: 'input' },
    { label: '关系实体1', attr: 'from', holder: '实体名称', type: 'select' },
    { label: '关系实体2', attr: 'to', holder: '实体名称', type: 'select' },
    { label: '关系权重', attr: 'value', holder: '1~20', type: 'input' }
  ]
}

export const typeMapper = {
  node: '实体',
  link: '关系'
}
