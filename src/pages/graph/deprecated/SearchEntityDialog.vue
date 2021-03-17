<template>
  <el-dialog 
        title= "查询实体"
        :visible.sync="searchDialogVisible"
        width="30%"
        :show-close="false"
        >
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="实体 ID">
        <el-input v-model="form.id"></el-input>
    </el-form-item>
    <el-form-item label="实体名称">
        <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="实体类别">
        <el-input v-model="form.group"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer">
    <el-button @click="setSearchDialogVisible(false)">取 消</el-button>
    <el-button type="primary" @click="setSearchDialogVisible(false)">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'SearchEntityDialog',
    data() {
        return {
            form: {
                id: '',
                name: '',
                group: '',
            }
        }
    },
    computed: {
        ...mapGetters([
            'searchDialogVisible'
        ])
    },
    methods: {
        ...mapMutations([
           'setSearchDialogVisible', 
        ]),
    }
}
</script>

<style>

</style>