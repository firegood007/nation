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
           <button class="btn" @click="terminal(1)">更新节目</button>
        </div>
        <div class="btn-ground_i">
           <button class="btn" @click="terminal(2)">升级APK</button>
        </div>
        <div class="btn-ground_i">
          <button class="btn" @click="terminal(10)">开屏</button>
        </div>
        <div class="btn-ground_i">
          <button class="btn" @click="terminal(11)">关屏</button>
        </div>
        
      </div>
      <div class="btn-ground">
         <div class="btn-ground_i">
            <button class="btn" @click="terminal(17)">上一个</button>
        </div>
         <div class="btn-ground_i">
            <button class="btn"@click="terminal(18)">下一个</button>
        </div>
        <div class="btn-ground_i">
            <button class="btn" @click="terminal(12)">显示ID</button>
        </div>
        <div class="btn-ground_i">
            <button class="btn" @click="terminal(13)">关闭显示ID</button>
        </div>
         <div class="btn-ground_i">
            <button class="btn" @click="terminal(19)">更新配置信息(apn)</button>
        </div>
        
      </div>
      <div class="btn-ground">
        <div class="btn-ground_i last">
          <input type="text" v-model='media'>
          <button class="btn" @click="terminal(14)">播放</button>
        </div>
        <div class="btn-ground_i last">
          <input type="text" v-model="light">
          <button class="btn" @click="terminal(15)">设置亮度</button>
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
                <nova-checkbox  v-model="checkAll" @onChange="toggleCheckAll" :disabled="appAll"></nova-checkbox>
              </th> 
              <th width="">
                <span>ID</span>
              </th>
              <th width="100">
                <span>IP</span>
              </th>
              <th width="">
                <span>SN</span>
              </th>
              <th width="">
                <span>命令执行状态</span>
              </th>
              <th width="80">
                <span>当前节目</span>
              </th>
              <th width="">
                <span>节目下载进度</span>
              </th>
              <th width="100" @click="toggleSort">
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
                <nova-checkbox v-model="item.check" @onChange="toggleCheck" :disabled="appAll"></nova-checkbox>
              </td>
              <td @dblclick="changeId(item, index)" width=“600”>
                <input type="number"  
                :class="['idtext', item.disabled? 'unactive' : 'active']" 
                :disabled="item.disabled"
                
                :ref="'input'+index"
                v-model="item.tid" />
                <button class="btn-edit search-btn" v-show="!item.disabled" @click="confirmId(item)">确定</button>
                <button class="btn-edit search-btn" v-show="!item.disabled" @click="cancelId(item)">取消</button>
              </td>
              <td width="100">{{item.ip}}</td>
              <td>{{item.sn}}</td>
              <td>{{item.order}}: {{item.orderStatus}}</td>
              <td width="80">{{item.play_media_id!=''? item.play_media_id: '暂无'}}</td>
              <td>
                <div v-if="item.media_download">
                  <span>完成：{{item.media_download.finish_count}}&nbsp;&nbsp;</span>
                  <span>总共：{{item.media_download.total_count}}</span>
                </div>
                <div>完成率：{{item.download}}</div>
              </td>
              <td width="100">{{item.version}}</td>
            </tr>
          </tbody>
        </table>
        <div class="page-foot">
          <nova-pagination :currentPage="page" :pageSize="size" :total="total" @curentChange="pageChange"></nova-pagination>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
let cacheId = null;
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
      id: '',

      page: 1,
      total: 20,
      size: 20

    }
  },
  methods: {
    confirmId(item){
      item.disabled = true;
      cacheId = null;
      let param 
      param = {
        all: false,
        sns: [item.sn],
        code: 16,
        data: {
          code: 16,
          value: item.tid
        }
      }
      ListModel.terminal(param).then(({body}) => {
        if (body.status == 0) {
          this.sucessM(Order[16] + '执行成功')
        } else {
          this.errorM(Order[16] + '执行失败')
        }
      })

    },
    cancelId(item) {
      item.tid = cacheId.id
      item.disabled = true;
      cacheId = null;
    },
    changeId(item, index) {
      this.list.forEach(item => {
        if (cacheId) {
          if (item.sn == cacheId.sn) {
            item.tid = cacheId.id
          }
        }
        item.disabled = true;
      })
      cacheId = {
        sn: item.sn,
        id: item.tid
      }
      let node = this.$refs['input' + index]
      item.disabled = false;
      this.$nextTick(() => {
        node[0].focus()
      })
      
    },
    
    
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
    pageChange(page) {
      this.page = page
      this.getList()
    },
    sucessM(message = '获取数据成功') {
      this.$notify({
        title: '成功',
        message: message,
        type: 'success'
      });
    },
    errorM(message = '获取数据错误') {
      this.$notify.error({
        title: '错误',
        message: message
      });
    },
    getOrderStatus(item) {
      item.order = Order[item.execute_order.code]
      item.orderStatus = OrderStatus[item.execute_order.status]
    },
    getDownload(item) {
      item.download = (item.media_download.finish_count / item.media_download.total_count).toFixed(3) * 100 + '%'
    },
    updateList(option) {
      if (option.code == 23) {
        this.list.forEach(item => {
          if (item.sn == option.sn) {
            item.execute_order = {
              code: option.execute_code,
              status: option.status
            }
            this.getOrderStatus(item)
          }
        })
      } else if (option.code == 21) {
        this.list.forEach(item => {
          if (item.sn == option.sn) {
            item.media_download = {
              finish_count: option.finish_count,
              total_count: option.total_count
            }
            this.getDownload(item)
          }
        })
      } else if (option.code == 20) {
        this.list.forEach(item => {
          if (item.sn == option.sn) {
            item.play_media_id = option.play_media_id
          }
        })

      }
    },
    forMatList(list) {
      list.forEach(item => {
        item.check = true
        item.disabled = true
        // 命令执行
        if (item.execute_order) {
          this.getOrderStatus(item)
        } else {
          item.order = '暂无'
          item.orderStatus = '暂无'
        }
        // 下载进度
        if (item.media_download) {
          this.getDownload(item)
        } else {
          item.download = '暂无'
        }
        
      })
    },
    terminal(type) {
      let result
      let param = {}, value, sns = []
      if (this.appAll) {
        
        if (type == 14 || type == 15 || type == 16) {
          value = type == 14 ? this.media : type == 15 ? this.light : this.id
          param = {
            all: true,
            code: type,
            data: {
                code: type,
                value: value
            }
          }
        } else {
          param = {
            all: true,
            code: type,
            sns: sns,
            data: {
                code: type
            }
          }
        }
        result = ListModel.terminal(param)
      } else {
        sns = [];
        this.list.forEach(item => {
          if (item.check) {
            sns.push(item.sn)
          }
        })
        if (type == 14 || type == 15) {
          value = type == 14 ? this.media : this.light
          param = {
            all: false,
            code: type,
            sns: sns,
            data: {
                code: type,
                value: value
            }
          }
        } else {
          param = {
            all: false,
            code: type,
            sns: sns,
            data: {
                code: type
            }
          }
        }
        result = ListModel.terminal(param)
      }
      result.then(({body}) => {
        if (body.status == 0) {
          this.sucessM(Order[type] + '执行成功')
        } else {
          this.errorM(Order[type] + '执行失败')
        }
      })
    },
    getList() {
      ListModel.getList({
        page: this.page,
        size: this.size
      }).then(({body}) => {
        if (body.status == 0) {
          this.sucessM()
          let data = body.data
          this.forMatList(data.list)
          this.list = data.list
          this.page = data.pagination.page
          this.total = data.pagination.total
          this.size = data.pagination.total
        } else {
          this.errorM()
        }
      })
    }
  },
  created() {
    this.getList()
    this.$on('curentChange', (page) => {
      onsole.log(123123)
    })
  },
  destroyed() {
    this.$off('curentChange')
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
  .idtext {
    width: 80px;
    background:#fff;
  }
  .active {
    border: 1px solid #43a3fb;
    outline: none;
  }
  .unactive {
    border: none;
  }
</style>
