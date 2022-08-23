<template>
  <el-card class="tree-card">
    <!-- 用了一个行列布局 -->
    <el-row align="middle" justify="space-between" style="height: 40px" type="flex">
      <el-col>
        <span>江苏传智播客教育科技股份有限公司</span>
      </el-col>
      <el-col :span="4">
        <el-row justify="end" type="flex">
          <!-- 两个内容 -->
          <el-col>负责人</el-col>
          <el-col>
            <!-- 下拉菜单 element -->
            <el-dropdown>
              <span>
                操作<i class="el-icon-arrow-down" />
              </span>
              <!-- 下拉菜单 -->
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>添加子部门</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-tree :data="departs" :default-expand-all="true" :props="defaultProps">
      <tree-tools slot-scope="{ data }" :tree-node="data" />
    </el-tree>
  </el-card>
</template>

<script>
import threeTools from './components/tree-tools'

export default {
  data() {
    return {
      departs: [{ name: '总裁办', manager: '曹操', children: [{ name: '董事会', manager: '曹丕' }] },
        { name: '行政部', manager: '刘备' },
        { name: '人事部', manager: '孙权' }],
      defaultProps: {
        label: 'name' // 表示 从这个属性显示内容
      }
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
