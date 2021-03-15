<template>
  <el-dialog 
        title= "增加实体"
        :visible.sync="insertDialogVisible"
        width="30%"
        :show-close="false"
        >
  <el-form ref="form" :model="form" label-width="80px">
    <el-form-item label="实体名称">
        <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="实体类别">
        <el-input v-model="form.group"></el-input>
    </el-form-item>
    <el-form-item label="实体权重">
        <el-input v-model="form.value"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer">
    <el-button @click="setInsertDialogVisible(false)">取 消</el-button>
    <el-button type="primary" @click="setInsertDialogVisible(false)">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'InsertEntityDialog',
    data() {
        return {
            form: {
                id: '',
                name: '',
                group: '',
                value: '',
            }
        }
    },
    computed: {
        ...mapGetters([
            'insertDialogVisible'
        ])
    },
    methods: {
        ...mapMutations([
           'setInsertDialogVisible', 
        ]),
    }
}
</script>

<style>

</style>