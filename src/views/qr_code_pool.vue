<template>
    <section class="main">
        <el-form ref="FormObj" :model="request_data" label-width="300px">
            <el-form-item label="上传二维码">
                <el-upload
                        class="upload-demo"
                        drag
                        :data="this.request_data"
                        action="/upload"
                        accept="image/*"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :before-upload="handlerUpload"
                        :on-progress="handlerProress"
                        :show-file-list="false"
                        :file-list="fileList"
                        multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过120kb</div>
                </el-upload>
            </el-form-item>
        </el-form>


<!--        <avue-crud style="margin-left:100px;"-->
<!--                   :option="option"-->
<!--                   ref="crud"-->
<!--                   :page="page"-->
<!--                   @on-load="onLoad"-->
<!--                   :table-loading="loading"-->
<!--                   @refresh-change="refreshChange"-->
<!--                   :data="data"-->
<!--                   @row-update="rowUpdate"-->
<!--                   @search-change="searchChange"-->
<!--                   v-model="obj" >-->
<!--            <template slot-scope="scope" slot="menu">-->
<!--                <el-button-->
<!--                        type="primary"-->
<!--                        size="mini"-->
<!--                        @click="rowCell(scope.row,scope.index)"-->
<!--                >{{scope.row.$cellEdit?'保存':'修改'}}</el-button>-->
<!--                <el-button-->
<!--                        type="danger"-->
<!--                        size="mini"-->
<!--                        @click="rowDel(scope.row)"-->
<!--                >删除</el-button>-->
<!--                <el-button-->
<!--                        type="primary"-->
<!--                        size="mini"-->
<!--                        @click="rowOpen(scope.row)"-->
<!--                >启用</el-button>-->
<!--            </template>-->
<!--        </avue-crud>-->
    </section>
</template>


<script>

    import { get_qrcode,del_qrcode,upd_qrcode ,open_qrcode ,agent_query,wechathelper_query , get_qrtype,paytype_get} from '~/api/request/request'

    import { imgjoin } from '~/api/utils'
    import { Loading } from 'element-ui';

    export default {
        data() {
            return {
                FormObj:[],
                FormObj1:[],
                FormObj2:[],
                paytypes:[],
                isFlag:false,
                fileList: [],
                loadingInstance:false,
                data : [],
                obj:{},
                loading:false,
                cellEdit: false,
                filter: {
                  name:''
                },
                request_data:{
                    qrtype:'',
                    token:localStorage.authorization_zhaocaibao,
                },
                page: {
                    // pageSizes: [2],
                    pageSize: 10,
                    currentPage:1,
                    total : 0
                },
                option:{
                    page:false,
                    align:'center',
                    menuAlign:'center',
                    border:true,
                    addBtn:false,
                    cellBtn:false,
                    maxHeight:300,
                    height:300,
                    editBtn: false,
                    delBtn : false,
                    searchMenuSpan:6,
                    size:"mini",
                    column:[
                        {
                            label:'订单号',
                            prop:'name',
                            search:false,
                            cell: true,
                            minWidth:150,
                            rules: [
                                {
                                    required: true,
                                    message: '请输入微信昵称',
                                    trigger: 'blur'
                                }
                            ]
                        },
                        // {
                        //     label:'二维码',
                        //     prop:'path',
                        //     type:'upload',
                        //     // imgType:'card',
                        //     listType:'picture-img',
                        //     cell: false
                        // },
                        {
                            label:'状态',
                            prop:'statusname',
                        },
                        {
                            label:'金额',
                            prop:'amount',
                        },
                        {
                            label:'创建时间',
                            prop:'createtime',
                            minWidth:150,
                        },
                    ]
                },
                optionForm:{
                    labelWidth:300,
                    size:"mini",
                    submitText: '选择码商',
                    menuPostion : 'left',
                    emptyBtn:false,
                    submitBtn:false,
                    column: [
                        {
                            label: "银行卡信息",
                            prop: "userid",
                            span:12,
                            row:true,
                            type: 'text',
                            parent:false,
                            placeholder:"请选择码商信息",
                            rules: [{
                                required: true,
                                message: "请选择码商信息"
                            }],
                            click: this.user_handler,
                        },
                    ]
                }
            };
        },
        watch: {
            request_data: {
                handler(newName, oldName) {
                    if(newName.qrtype === 'QR001'){
                        this.isFlag=true
                    }else{
                        this.isFlag=false
                    }
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            handleRemove(file, fileList) {
                console.log( file, fileList );
            },
            handlePreview(file) {
                console.log(file);
            },
            handleSuccess( response, file, fileList ){
                this.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
                    this.loadingInstance.close();
                });
                if ( response.rescode !== '10000' ){
                    this.$message.error(response.msg)
                } else {
                    this.QueryQrcode()
                    this.$message.success("上传成功!")
                }
            },
            handlerProress(event, file, fileList){
                this.loadingInstance = Loading.service({text:'上传中,请稍等!'});
                console.log(fileList)
            },
            handlerUpload(file) {
                console.log( file.type )
                const isJPG = file.type.split('/')[0] === 'image';
                const isLt2M = file.size / 1024  < 500;

                if (!isJPG) {
                    this.$message.error('必须是图片格式!');
                }
                if (!isLt2M) {
                    this.$message.error('上传头像图片大小不能超过 120KB!');
                }
                return isJPG && isLt2M;
            },
            onLoad(page) {
                this.page.currentPage = page.currentPage
                this.QueryQrcode()
            },
            searchChange(params){
                this.filter.name = params.name
                this.QueryQrcode()
            },
            refreshChange(){
                this.QueryQrcode()
            },
            rowCell(row, index) {
                this.$refs.crud.rowCell(row, index)
            },
            rowDel(row,index){
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    del_qrcode({
                        data : {"id":row.id},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("删除成功!")
                        },
                    })
                })
            },
            rowOpen(row,index){
                this.$confirm('确认启用吗？', '提示', {}).then(() => {
                    open_qrcode({
                        data : {"id":row.id},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("启用成功!")
                        },
                    })
                })
            },
            rowUpdate(form, index, done) {
                console.log(form)
                this.$confirm('确认提交吗？', '提示', {}).then(() => {
                    upd_qrcode({
                        data : {"id":form.id,"name":form.name},
                        callback : () => {
                            this.QueryQrcode()
                            this.$message.success("修改成功!")
                            done()
                        },
                    })
                })
            },
            QueryQrcode(){
                this.loading=true
                get_qrcode({
                    "params":{
                        "status" : "1",
                        "page" : this.page.currentPage,
                        "page_size" : this.page.pageSize,
                        "name" : this.filter.name,
                    },
                    "callback": (res)=>{
                        this.data=[]
                        res.data.data.forEach(item => {
                            this.data.push({
                                path : imgjoin(item.path ),
                                name : item.name,
                                id : item.id,
                                statusname : item.statusname,
                                createtime : item.createtime
                            })
                        })
                        console.log(this.data)
                        this.page.total = Number(res.headers.total)
                        this.loading=false
                    },
                    errorcallback : () => {
                        this.loading=false
                    }
                })
            }
        },
        mounted() {
            // this.QueryQrcode()
            // paytype_get({
            //     "callback": (res)=>{
            //         this.paytypes=res.data.data
            //     }
            // })
            // get_qrtype({
            //     "params":{
            //         "status" : "0",
            //         "page" : 1,
            //         "page_size" : 99999999,
            //         "type" : "3"
            //     },
            //     "callback": (res)=>{
            //         this.FormObj2=res.data.data
            //         console.log(this.FormObj2)
            //     }
            // })
            // agent_query({
            //     "params":{
            //         "status" : "0",
            //         "page" : 1,
            //         "page_size" : 99999999,
            //         "type" : "3"
            //     },
            //     "callback": (res)=>{
            //         this.FormObj=res.data.data
            //     }
            // })
            // wechathelper_query({
            //     "params":{
            //         "page" : 1,
            //         "page_size" : 99999999
            //     },
            //     "callback": (res)=>{
            //         this.FormObj1=res.data.data
            //     }
            // })
        }
    }
</script>

<style scoped="scoped" lang="scss">
</style>