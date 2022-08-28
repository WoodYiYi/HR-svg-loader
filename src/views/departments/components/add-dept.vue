<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form ref="deptForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" placeholder="1-50个字符" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" placeholder="1-50个字符" style="width:80%" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select v-model="formData.manager" placeholder="请选择" style="width:80%" @focus="getEmployeeSimple">
          <el-option v-for="item in peoples" :key="item.id" :label="item.username" :value="item.username" />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input v-model="formData.introduce" :rows="3" placeholder="1-300个字符" style="width:80%" type="textarea" />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" justify="center" type="flex">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>

import { addDepartments, getDepartDetail, getDepartments, getEmployeeSimple, updateDepartments } from '@/api/departments'

export default {
  name: 'AddDept',
  // 需要传入一个props变量来控制 显示或者隐藏
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const checkNameRepeat = async(rule, value, callback) => {
      // 获取到最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑 张三 => 校验规则 除了我之外 同级部门下 不能有叫张三的
        isRepeat = depts.filter(item => item.id !== this.formData.id && item.pid === this.treeNode.pid).some(item => item.name === value)
      } else {
        // 没id就是新增模式
        isRepeat = depts.filter(item => item.pid === this.treeNode.id).some(item => item.name === value)
      }
      isRepeat ? callback(new Error(`同级部门下已经有${value}的部门了`)) : callback()
    }
    // 检查编码重复
    const checkCodeRepeat = async(rule, value, callback) => {
      // 先要获取最新的组织架构数据
      const { depts } = await getDepartments()
      let isRepeat = false
      //  检查重复规则 需要支持两种 新增模式 / 编辑模式
      if (this.formData.id) {
        // 编辑模式  因为编辑模式下 不能算自己
        isRepeat = depts.some(item => item.id !== this.formData.id && item.code === value && value)
      } else {
        // 新增模式
        isRepeat = depts.some(item => item.code === value && value) // 这里加一个 value不为空 因为我们的部门有可能没有code
      }
      isRepeat ? callback(new Error(`组织架构中已经有部门使用${value}编码`)) : callback()
    }
    return {
      // 表单数据
      formData: {
        name: '', // 部门名称
        code: '', // 部门编码
        manager: '', // 部门管理者
        introduce: '' // 部门介绍
      },
      rules: {
        name: [
          {
            required: true, message: '部门名称不能为空', trigger: 'blur'
          },
          {
            min: 1, max: 50, message: '部门名称要求1-50个字符', trigger: 'blur'
          },
          {
            validator: checkNameRepeat,
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true, message: '部门编码不能为空', rigger: 'blur'
          },
          {
            min: 1, max: 50, message: '部门编码要求1-50字符', trigger: 'blur'
          },
          {
            validator: checkCodeRepeat,
            trigger: 'blur'
          }
        ],
        manager: [
          {
            required: true, message: '部门负责人不能为空', trigger: 'blur'
          }
        ],
        introduce: [
          {
            required: true, message: '部门介绍不能为空', trigger: 'blur'
          },
          {
            min: 1, max: 300, message: '部门介绍要求1-300字符', trigger: 'blur'
          }
        ]
      },
      peoples: [] // 接收获取的员工简单列表的数据
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增子部门'
    }
  },
  created() {
    console.log(this.showDialog)
  },
  methods: {

    // 获取到员工的简单列表
    async getEmployeeSimple() {
      this.peoples = await getEmployeeSimple()
    },

    // 获取部门详情
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id)
    },

    // 点击确认触发
    btnOK() {
      this.$refs.deptForm.validate(async isOK => {
        console.log('确认前')
        if (isOK) {
          // 要分清楚现在是编辑还是新增
          if (this.formData.id) {
            // 编辑模式  调用编辑接口
            await updateDepartments(this.formData)
          } else {
            // 新增模式
            await addDepartments({ ...this.formData, pid: this.treeNode.id }) // 调用新增接口 添加父部门的id
          }
          // 表示可以提交了
          this.$emit('addDepts') // 告诉父组件 新增数据成功 重新拉取数据
          // update:props名称
          this.$emit('update:showDialog', false)
        }
      })
    },

    // 点击取消触发
    btnCancel() {
      // 重置数据  因为resetFields 只能重置 表单上的数据 非表单上的 比如 编辑中id 不能重置
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false) // 关闭弹框
      this.$refs.deptForm.resetFields() // 清除数据
    }
  }
}

</script>

