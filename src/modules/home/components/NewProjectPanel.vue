<template>
  <el-dialog
    title="新建知识图谱项目"
    :visible="showCreatePanel"
    @close="disablePanel()"
    width="45%"
  >
    <el-form
      ref="form"
      :model="form"
      label-width="150px"
      :rules="xmlInput ? rulesWithXml : rulesWithoutXml"
    >
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入项目名称"></el-input>
      </el-form-item>
      <el-form-item label="项目描述" prop="description">
        <el-input
          type="textarea"
          placeholder="请输入项目描述"
          :autosize="{ minRows: 2, maxRows: 4 }"
          v-model="form.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="知识图谱xml" prop="xml">
        <el-radio-group size="mini" v-model="xmlRadio">
          <el-radio label="空项目" @change="disableXmlInput()"></el-radio>
          <el-radio label="xml导入" @change="visibleXmlInput()"></el-radio>
        </el-radio-group>
        <el-input
          v-if="xmlInput"
          type="textarea"
          placeholder="请输入知识图谱 xml"
          :autosize="{ minRows: 5, maxRows: 12 }"
          v-model="form.xml"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="resetForm()">重 置</el-button>
      <el-button type="primary" @click="doneCreate()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { $message } from '@/common/utils'

export default {
  name: 'NewProjectPanel',
  data() {
    return {
      form: {
        name: '',
        description: '',
        xml: ''
      },
      xmlInput: false,
      xmlRadio: '空项目',
      rulesWithXml: {
        name: [{ required: true, message: '项目名称不能为空!' }],
        description: [{ required: true, message: '项目描述不能为空!' }],
        xml: [{ required: true, message: '知识图谱 xml 不能为空!' }]
      },
      rulesWithoutXml: {
        name: [{ required: true, message: '项目名称不能为空!' }],
        description: [{ required: true, message: '项目描述不能为空!' }]
      }
    }
  },
  computed: {
    ...mapGetters(['showCreatePanel', 'userId'])
  },
  methods: {
    ...mapMutations(['setShowCreatePanel']),
    ...mapActions(['createProject']),
    doneCreate() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const { name, description, xml } = this.form
          const projectParam = {
            name,
            description,
            userId: Number(this.userId),
            xml: xml === '空项目' ? '' : xml
          }
          console.log('projectParam', projectParam)
          this.createProject(projectParam)
            .catch(msg => {
              $message(msg, 'error')
            })
            .then(projectId => {
              this.$router.push(`/graph/${projectId}`)
            })
            .catch(msg => {
              $message('router fail')
            })
        } else {
          console.log('error')
        }
      })
    },
    disablePanel() {
      this.setShowCreatePanel(false)
    },
    disableXmlInput() {
      this.xmlInput = false
    },
    visibleXmlInput() {
      this.xmlInput = true
    },
    resetForm() {
      this.$refs.form.resetFields()
    }
  }
}
</script>

<style></style>
