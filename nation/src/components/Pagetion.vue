<template>
  <div class="nova-pagination nova-clearfix">
    <div class="nova-pagination__info nova-left">
      {{pageInfo}}
    </div>
    <div class="nova-pagination__main nova-right">
      <div class="nova-pagination__jump">
        <span class="jump-label">前往</span>
        <input type="text" class="jump-input" v-model="jumper" @keyup.prevent="jumpKeydown" @change="jumperChange">
        <span class="jump-label">页</span>
      </div>
      <div class="nova-pagination__pages">
        <el-pagination class="nova-pagination__pager" layout="prev, pager, next" :total="total" :pageSize="pageSize" :currentPage="index"
          @size-change="sizeChange" @current-change="currentChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nova-pagination',
    props: {
      total: {
        type: Number,
        default: 1,
      },
      pageSize: {
        type: Number,
        default: 20,
      },
      currentPage: {
        type: Number,
        default: 1
      }
    },
    computed: {
      totalPages() {
        return Math.ceil(this.total / this.pageSize)
      },
      pageInfo() {
        return `共${this.total}条记录， 第${this.index}/${this.totalPages}页`
        // return $t('common.totalNums', { total: this.total }) + ' ' + $t('common.whichPage', { index: this.index, pages: this.totalPages })
      }
    },
    data() {
      return {
        index: this.currentPage,
        jumper: this.currentPage,
        originalJumper: this.currentPage
      }
    },
    methods: {
      jumpKeydown() {
        if (this.jumper) {
          let jumper = Number(this.jumper)
          if (typeof jumper !== 'number' || isNaN(jumper))
            jumper = this.originalJumper
          jumper = Math.floor(jumper)
          this.jumper = jumper
          this.originalJumper = jumper
        }
      },
      jumperChange() {
        let jumper = Number(this.jumper)
        if (isNaN(jumper))
          jumper = this.originalJumper
        if (jumper < 1) jumper = 1
        if (jumper > this.totalPages)
          jumper = this.totalPages
        jumper = Math.floor(jumper)
        this.jumper = jumper
        this.originalJumper = jumper
        if (this.jumper !== this.index) {
          this.index = this.jumper
          this.currentChange(this.jumper)
        }
      },
      sizeChange(size) {
        this.$emit('sizeChange', this.size)
      },
      currentChange(currentPage) {
        this.index = currentPage
        this.$emit('curentChange', this.index)
      }
    },
    watch: {
      index() {
        this.jumper = this.originalJumper = this.index
      },
      currentPage() {
        this.index = this.currentPage
      }
    }
  }
</script>