<template>
  <el-dialog 
        title= "修改实体"
        :visible.sync="modifyDialogVisible"
        width="30%"
        :show-close="false"
        >
  <el-form ref="form" :model="form" label-width="120px">
    <el-form-item label="欲修改实体 ID">
        <el-input v-model="form.id"></el-input>
    </el-form-item>
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
    <el-button @click="setModifyDialogVisible(false)">取 消</el-button>
    <el-button type="primary" @click="setModifyDialogVisible(false)">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
    name: 'ModifyEntityDialog',
    data() {
        return {
            form: {
                id: '',
                name: '',
                group: '',
                value: ''
            }
        }
    },
    computed: {
        ...mapGetters([
            'modifyDialogVisible'
        ])
    },
    methods: {
        ...mapMutations([
           'setModifyDialogVisible', 
        ]),
    }
}
</script>

<style>

</style>