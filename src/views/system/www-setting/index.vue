<template>
  <div class="main-area">
    <Row>
        <Col span="15">
            <Card>
                <p slot="title" style="text-align:center;">系统设置</p>
                <p class="itemlist"><span>站点名称：</span><span>{{form.webName}}</span></p>
                <p class="itemlist"><span>App名称：</span><span>{{form.appName}}</span></p>
                <p class="itemlist"><span>App下载地址：</span><span>{{form.appDownLoad}}</span></p>
                <p class="itemlist"><span>SMTP地址：</span><span>{{form.smtp}}</span></p>
                <p class="itemlist"><span>邮件用户名：</span><span>{{form.userName}}</span></p>
                <p class="itemlist"><span>短信用户名：</span><span>{{form.msgUserName}}</span></p>
                <p class="itemlist" @click="handleEdit"><span>编辑<Icon type="md-create" /></span></p>
            </Card>
        </Col>
    </Row>
    <br><br>
    <Row>
       <Col span="15">
        <search-area
            @search="search"
            @reset="reset"
            :defaultForm="defaultForm"
            :moreForm="moreForm"
            v-model="query"
          />
          <Card>
                 <p slot="title" style="text-align:center;">用户活跃度</p>
                <p class="itemlist"><span>注册用户数量：</span><span>{{form1.registerCount}}</span></p>
                <p class="itemlist"><span>登录用户数量：</span><span>{{form1.loginCount}}</span></p>
                <p class="itemlist"></p>
          </Card>
        </Col>
    </Row>

    <Modal
        title="系统设置："
        width="800"
        v-model="isSettingEdit"
        :styles="{top: '100px'}"
        @on-ok="submitEdit"
        @on-cancel="cancleEdit"
        >
        <Form :label-width="120" class="editForm"  :model='form' :rules="rules" ref="form">
          <Row :gutter="20" >
            <Col span="11">
              <FormItem label="网站名称:" prop="webName">
                <Input  v-model="form.webName"></Input>
              </FormItem>
            </Col>
            <Col span="11">
              <FormItem label="App名称:" prop="appName">
                <Input  v-model="form.appName"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row :gutter="20">
              <FormItem label="App下载地址:" prop="appDownLoad">
                <Input  v-model="form.appDownLoad"></Input>
              </FormItem>
          </Row>

          <Row :gutter="20">
              <FormItem label="SMTP地址:" prop="smtp">
                <Input  v-model="form.smtp"></Input>
              </FormItem>
          </Row>
          <Row :gutter="20">
              <FormItem label="邮件用户名:" prop="userName">
                <Input  v-model="form.userName"></Input>
              </FormItem>
          </Row>
          <Row :gutter="20">
              <FormItem label="邮件昵称:" prop="nickName">
                <Input  v-model="form.nickName"></Input>
              </FormItem>
          </Row>
          <Row :gutter="20">
              <FormItem label="短信用户名" prop="msgUserName">
                <Input  v-model="form.msgUserName"></Input>
              </FormItem>
          </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import { 
  get_www_setting_page,
  update_www_setting_page,
  get_user_active
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "www-setting",
  mixins: [mixin],
  data(){
    return{
      title: '',
      isSettingEdit: false,
      form: {},
      form1: {},
      btnLoading: true,
      rules:{
        webName: [
          { required: true, message: '请填写网站名称', trigger: 'blur' }
        ],
        appName: [
          { required: true, message: '请填写App名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '统计时间段',
          type: 'timeRange',
          field: 'date',
        },
      ]
    },
    moreForm(){
      return []
    }
  },
  methods:{
    cancleEdit(){
      this.isSettingEdit = false;
      this.getDatas();
    },
    async submitEdit(){
      this.btnLoading = true;
      const res = await update_www_setting_page(this.form);
      this.btnLoading = false;
      if (res.status == 200) {
        this.$Message.success('修改成功！');
      }
    },
    handleEdit(){
      this.isSettingEdit = true;
    },
    async getDatas() {

      this.btnLoading = true;
      const res = await get_www_setting_page();
      this.btnLoading = false;
      if (res.status == 200) {
        this.form = res.data;
      }
    },
    async getData(){
      let query = {};
      if(this.query.date[0]){
        query.startTime = this.query.date[0];
        query.endTime = this.query.date[1];
      }
      const res = await get_user_active(query);
      // console.log(res.data)
      if (res.status == 200) {
        this.form1 = res.data.data;
      }
    }
  },
  mounted() {
    this.getDatas();
  },
}
</script>
<style lang="less" scoped>
.main-area{
  padding: 50px;
  min-height: 600px;
  .itemlist{display: flex; line-height:30px;text-align: right;
   span:first-child{width: 120px;text-align: right;}
  }
  .itemlist:last-child{color: rgb(174, 0, 255);padding-right:20px;
    span{
      width:100%;
      font-size:16px;
      cursor: pointer;
      &:hover{color:#3b69e2;}
    .ivu-icon{line-height: 32px;padding-left: 5px;}
    }
  }
  .editForm{padding: 20px;box-sizing: border-box;}
}

.ivu-row{margin-right: 15px!important;}

</style>