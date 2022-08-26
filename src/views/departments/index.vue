<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 实现页面的基本布局 -->
      <el-card class="tree-card">
        <!-- 用了一个行列布局 -->
        <!-- 缺少treeNode -->
        <tree-tools :is-root="true" :tree-node="company" />
        <!--default-expand-all 默认所有节点展开-->
        <el-tree :data="departs" :props="defaultProps" default-expand-all>
          <!-- :data="departs" 指展示的数据 :props="defaultProps" 指定节点标签为节点对象的某个属性值-->
          <tree-tools slot-scope="{data}" :tree-node="data" @addDepts="addDepts" @delDepts="getDepartments" />
        </el-tree>
      </el-card>
      <!-- 放置新增弹层组件  -->
      <add-dept :show-dialog="showDialog" />
    </div>
  </div>
</template>

<script>
import TreeTools from './components/tree-tools'
import AddDept from './components/add-dept' // 引入新增部门组件
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'

export default {
  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {},
      departs: [],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      },
      showDialog: false
    }
  },
  created() {
    this.getDepartments() // 调用自身方法
  },
  methods: {
    // 获取组织架构
    async getDepartments() {
      const result = await getDepartments()
      this.company = { name: result.companyName, manager: '负责人' }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
    },

    // 添加部门
    addDepts(node) {
      console.log(1234)
      this.showDialog = true // 显示弹层
      // 因为node是当前的点击的部门， 此时这个部门应该记录下来,
      this.node = node
    }
  }
}
</script>

<style scoped>

.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}

</style>
