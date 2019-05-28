<template>
  <label class="nova-checkbox" @click.stop>
    <input type="checkbox" :name="name" :value="label" :disabled="disabled" v-model="val" @change="change" :id="id">
    <div class="nova-checkbox__wrap">
      <span class="nova-checkbox__label" v-if="$slots.left">
        <slot name="left"></slot>
      </span>
      <span class="nova-checkbox__icon"></span>
      <span class="nova-checkbox__label" v-if="$slots.default" >
        <slot></slot>
      </span>
    </div>
  </label>
</template>

<script>
  
  export default {
    name: 'nova-checkbox',
    props: {
      value: [String, Number, Boolean, Array],
      label: String,
      name: String,
      id: String,
      disabled: Boolean,
    },
    data() {
      return {
        val: this.value
      }
    },
    methods: {
      /**
       * [change description] 只负责 跟新组件新值
       * @return {[type]} [description]
       */
      change() {
        //更新值
        if (this.loadnum) {
          this.val = false;
        }
        this.$emit('input', this.val)
        //处理其他相关业务。
        this.$emit('onChange', this.val)
      }
    },
    watch: {
      /**
       * [value description] 当全选了,  toggleCheckAll 会更新 其他子项的值，对其他子项进行一次赋值，
       * @return {[type]} [description]
       */
      value() {
        this.val = this.value
      }
    }
  }
</script>