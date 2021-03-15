<template>
  <el-dialog 
        title= "删除实体"
        :visible.sync="deleteDialogVisible"
        width="30%"
        :show-close="false"
        >
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="实体 ID">
        <el-input v-model="form.name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer">
    <el-button @click="setDeleteDialogVisible(false)">取 消</el-button>
    <el-button type="primary" @click="setDeleteDialogVisible(false)">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'DeleteEntityDialog',
    data() {
        return {
            form: {
                id: '',
            }
        }
    },
    computed: {
        ...mapGetters([
            'deleteDialogVisible'
        ])
    },
    methods: {
        ...mapMutations([
           'setDeleteDialogVisible', 
        ]),
    }
}
</script>

<style>

</style>