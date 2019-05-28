<template>
  <div class="home">
    <div class="home-head">
      <div>
        <nova-checkbox :name="all" v-model="appAll"  :id="all" @onChange="toggleAppALl">
          <label for="all" class="all" >应用全部</label>
        </nova-checkbox>
        
      </div>
      <div class="btn-ground">
        <div class="btn-ground_i">
           <button class="btn" @click="updateBatch(1)">更新节目</button>
        </div>
        <div class="btn-ground_i">
           <button class="btn" @click="updateBatch(2)">升级APK</button>
        </div>
        <div class="btn-ground_i">
          <button class="btn" @click="updateBatch(10)">开屏</button>
        </div>
        <div class="btn-ground_i">
          <button class="btn" @click="updateBatch(11)">关屏</button>
        </div>
        <div class="btn-ground_i last">
          <input type="text" v-model='media'>
          <button class="btn">播放</button>
        </div>
      </div>
      <div class="btn-ground">
         <div class="btn-ground_i">
            <button class="btn" @click="updateBatch(17)">上一个</button>
        </div>
         <div class="btn-ground_i">
            <button class="btn"@click="updateBatch(18)">下一个</button>
        </div>
        <div class="btn-ground_i">
            <button class="btn" @click="updateBatch(12)">显示ID</button>
        </div>
        <div class="btn-ground_i">
            <button class="btn" @click="updateBatch(13)">关闭显示ID</button>
        </div>
         <div class="btn-ground_i">
            <button class="btn">配置信息</button>
        </div>
        <div class="btn-ground_i last">
          <input type="text" v-model="light">
          <button class="btn">设置亮度</button>
        </div>
      </div>
    </div>
    <div class="home-cont">
      <div>
        <input type="text" placeholder="请输入关键字搜索" class="search" />
        <button class="btn search-btn">搜索</button>
      </div>
      <div>
        <table class="nova-table">
          <thead>
            <tr>
              <th width="30">
                <nova-checkbox  v-model="checkAll" @onChange="toggleCheckAll" ></nova-checkbox>
              </th> 
              <th width="">
                <span>ID</span>
              </th>
              <th width="">
                <span>IP</span>
              </th>
              <th width="">
                <span>SN</span>
              </th>
              <th width="">
                <span>命令执行状态</span>
              </th>
              <th width="">
                <span>当前节目</span>
              </th>
              <th width="">
                <span>节目下载进度</span>
              </th>
              <th width="" @click="toggleSort">
                <span>版本</span>
                <span class="table-sort">
                    <i class="both" :class="{asc: sortType === 'asc', desc: sortType == 'desc'}"></i>
                </span>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div>
        <table class="nova-table">
          <tbody>
            <tr v-for="(item, index) in list" :key="index">
              <td width="30">
                <nova-checkbox v-model="item.check" @onChange="toggleCheck"></nova-checkbox>
              </td>
              <td>{{item.tid}}</td>
              <td>{{item.ip}}</td>
              <td>{{item.sn}}</td>
              <td>{{item.order}}: {{item.orderStatus}}</td>
              <td>{{item.play_media_id}}</td>
              <td>
                <div>
                  <span>完成：{{item.media_download.finish_count}}&nbsp;&nbsp;</span>
                  <span>总共：{{item.media_download.total_count}}</span>
                </div>
                <div>完成率：{{item.download}}</div>
              </td>
              <td>{{item.version}}</td>
            </tr>
          </tbody>
        </table>
        <div class="page-foot">
          <nova-pagination :currentPage="page" :total="count" @curentChange="pageChange"></nova-pagination>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
import NovaCheckbox from '@/components/Checkbox'
import NovaPagination from '@/components/Pagetion'
import ListModel from '@/models/home.js'
import {Order, OrderStatus} from '@/lib/order.js'
import mixin from './mixin.js'
export default {
  name: 'home',
  components: {
    NovaCheckbox,
    NovaPagination
  },
  mixins: [mixin],
  data () {
    return {
      all: 'all',
      appAll: true,
      checkAll: true,
      media: 2,
      light: 30,
      list: [],
      sortType: '',

      page: 1,
      count: 20,

    }
  },
  methods: {
    toggleAppALl() {
      if (this.appAll) {
        this.checkAll = true
        this.list.forEach(item => {
          item.check = this.checkAll
        })
      }
    },
    toggleCheckAll() {
      this.list.forEach(item => {
        item.check = this.checkAll
      })
    },
    toggleCheck() {
      this.checkAll = this.getCheck() ? true : false
    },
    getCheck() {
      return this.list.every(item => {
        return item.check == true
      })
    },
    toggleSort() {
      if (this.sortType == '' || this.sortType == 'asc') {
        this.sortType = 'desc'
        let list = this.list.sort((a, b) => {
          if (a.version < b.version) return 1;
          else if (a.version > b.version) return -1;
          else return 0;
        })
        this.list = list;
      } else {
        this.sortType = 'asc'
        let list = this.list.sort((a, b) => {
          if (a.version < b.version) return -1;
          else if (a.version > b.version) return 1;
          else return 0;
        })
      }
    },
    pageChange() {

    },
    forMatList(list) {
      list.forEach(item => {
        item.check = true
        item.order = Order[item.execute_order.code]
        item.orderStatus = OrderStatus[item.execute_order.status]
        item.download = (item.media_download.finish_count / item.media_download.total_count).toFixed(3) * 100 + '%'
      })
    }
  },
  created() {
    ListModel.getList({}).then(({body}) => {
      if (body.status == 0) {
        
        this.$notify({
          title: '成功',
          message: '获取数据成功',
          type: 'success'
        });
        let data = body.data
        this.forMatList(data.list)
        this.list = data.list
        this.page = data.pagination.page
        this.count = data.pagination.count
      } else {
         this.$notify.error({
          title: '错误',
          message: '获取数据错误'
        });
      }
    })
  },
  watch: {
    media(val) {
      if (!/^[1-9]\d*$/.test(val)) {
        this.media = ''
      }
    },
    light(val) {
      if (!/^[1-9]+\d*$/.test(val)) {
        this.light = ''
      }
    }
  }
}
</script>

<style lang="scss">
 
  
</style>
