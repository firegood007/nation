export default {
    data() {
        return {
            path: 'ws://172.16.82.103:9501?from=web'
        }
    },
    methods: {
        init: function () {
            if(typeof(WebSocket) === "undefined"){
                alert("您的浏览器不支持socket")
            }else{
                // 实例化socket
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误")
        },
        getMessage: function (msg) {
            console.log(msg.data)
        },
        send: function (params) {
            this.socket.send(params)
        },
        close: function () {
            console.log("socket已经关闭")
        },
        // 更新节目
        updateProgram(type) {
            this.send({
                all: true,
                code: type,
                data: {
                    code: type
                }
            })
        }
    },
    mounted() {
        this.init()
    },
    destroyed () {
        // 销毁监听
        this.socket.onclose = this.close
    }
}