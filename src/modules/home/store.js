import api from '@/api/dispatcher';
import { SnapshotCache } from './utils/snapshot';

const fillSnapShot = projects => {
  return projects.map(project => {
    if (!project.snapshot) {
      const snapshot = SnapshotCache.get(project.projectId);
      if (snapshot) {
        project.snapshot = snapshot;
      }
    }
    return project;
  });
};

const home = {
  state: {
    ownProjects: [],
    allProjects: [],
    projectInfo: {},
    showCreatePanel: false,
    allPageNo: 1,
    ownPageNo: 1,
    allListCount: 0,
    ownListCount: 0,
  },
  mutations: {
    setOwnProjects(state, data) {
      state.ownProjects = fillSnapShot(data);
    },
    setOwnProjectsSnapshot(state, project) {
      let targetIndex = -1;
      state.ownProjects.forEach((_project, index) => {
        if (_project.projectId === project.projectId) {
          targetIndex = index;
        }
      });
      if (targetIndex < 0) {
        console.log('[setAllProjectsSnapshot] update not exist project');
        console.log('[setAllProjectsSnapshot] allProjects', state.allProjects);
        console.log('[setAllProjectsSnapshot] project', project);
      } else {
        const projects = state.ownProjects;
        state.ownProjects = [
          ...projects.slice(0, targetIndex),
          project,
          ...projects.slice(targetIndex + 1),
        ];
      }
    },
    setAllProjects(state, data) {
      state.allProjects = fillSnapShot(data);
    },
    setAllProjectsSnapshot(state, project) {
      let targetIndex = -1;
      state.allProjects.forEach((_project, index) => {
        if (_project.projectId === project.projectId) {
          targetIndex = index;
        }
      });
      if (targetIndex < 0) {
        console.log('[setAllProjectsSnapshot] update not exist project');
        console.log('[setAllProjectsSnapshot] allProjects', state.allProjects);
        console.log('[setAllProjectsSnapshot] project', project);
      } else {
        const projects = state.allProjects;
        state.allProjects = [
          ...projects.slice(0, targetIndex),
          project,
          ...projects.slice(targetIndex + 1),
        ];
      }
    },
    setProjectInfo(state, data) {
      state.projectInfo = data;
    },
    setShowCreatePanel(state, data) {
      state.showCreatePanel = data;
    },
    setAllPageNo(state, data) {
      state.allPageNo = data;
    },
    setOwnPageNo(state, data) {
      state.ownPageNo = data;
    },
    setAllListCount(state, data) {
      state.allListCount = data;
    },
    setOwnListCount(state, data) {
      state.ownListCount = data;
    },
  },
  actions: {
    // getListByUserId: async ({ commit }, userId) => {
    //   const res = await api.getListByUserId(userId)
    //   if (res.status === 200) {
    //     const projects = res.data
    //     commit('setOwnProjects', projects)
    //   } else {
    //     console.error('getListByUserId error')
    //   }
    // },
    getAllListByPageNo: async ({ commit }, pageNo) => {
      const res = await api.getAllListByPageNo(pageNo);
      if (res.status === 200) {
        const projects = res.data;
        commit('setAllProjects', projects);
      } else {
        console.error('getAllListByPageNo error');
      }
    },
    getOwnListByPageNo: async ({ commit }, data) => {
      const res = await api.getOwnListByPageNo(data);
      if (res.status === 200) {
        const projects = res.data;
        commit('setOwnProjects', projects);
      } else {
        console.error('getOwnListByPageNo error');
      }
    },
    getAllListAmount: async ({ commit }) => {
      const res = await api.getAllListCount();
      commit('setAllListCount', res.data);
    },
    getOwnListAmount: async ({ commit }, userId) => {
      const res = await api.getOwnListCount(userId);
      commit('setOwnListCount', res.data);
    },
    getProjectInfo: async ({ commit, state }, projectId) => {
      if (projectId === state.projectId) return true;
      const res = await api.getProjectInfo(projectId);
      if (res.status === 200) {
        commit('setProjectInfo', res.data);
        return res.data;
      } else {
        console.error('getProjectInfo error');
        return null;
      }
    },
    createProject: async ({ commit }, data) => {
      const res = await api.createProject(data);
      if (res.status === 200) {
        const projectInfo = res.data;
        commit('setProjectInfo', projectInfo);
        return projectInfo.projectId;
      } else if (res.status === 500) {
        return Promise.reject(res.data.msg);
      } else {
        console.error('[home/store/createProject] createProject error');
        return Promise.reject('unknown error');
      }
    },
  },
  getters: {
    ownProjects: state => state.ownProjects,
    projectInfo: state => state.projectInfo,
    showCreatePanel: state => state.showCreatePanel,
    allProjects: state => state.allProjects,
    allPageNo: state => state.allPageNo,
    allListCount: state => state.allListCount,
    ownProjects: state => state.ownProjects,
    ownPageNo: state => state.ownPageNo,
    ownListCount: state => state.ownListCount,
  },
};

export default home;
