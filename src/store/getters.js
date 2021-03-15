const getters = {
    // graph
    graphData: state => state.graph.graphData,
    insertDialogVisible: state => state.graph.insertDialogVisible,
    deleteDialogVisible: state => state.graph.deleteDialogVisible,
    modifyDialogVisible: state => state.graph.modifyDialogVisible,
    searchDialogVisible: state => state.graph.searchDialogVisible,
    projectID: state => state.graph.projectID,
}

export default getters;
