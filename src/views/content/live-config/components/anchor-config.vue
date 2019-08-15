
<template>
  <div class="main-area">
    <search-area
      @search="search"
      @reset="reset"
      :defaultForm="defaultForm"
      :moreForm="moreForm"
      v-model="query"
    />

    <div class="table-area">
      <Table :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="img">
          <img :src='row.img' width='50' height='50' v-if='row.img'></img>
        </template>
        <template slot-scope="{ row }" slot="status">
          <Tag color="default" v-if="!row.status">下线</Tag>
          <Tag color="green" v-if="row.status">在线</Tag>    
        </template>
        <template slot-scope="{ row }" slot="recommend">
          <i-switch
            v-model="row.recommend"
            size="large"
            @on-change="value => setRecommend(value, row)"
            :loading="btnLoading"
          >
            <span slot="open">是</span>
            <span slot="close">否</span>
          </i-switch>
        </template>
        <!-- <template slot-scope="{ row,index }" slot="action" >
           <Button type="success" @click='edit(row,index)' :loading="btnLoading">进入主播间</Button>&nbsp;
        </template> -->
      </Table>
      <div class="pagination">
        <Page
          :total="total"
          @on-change="pageChange"
          :current.sync="page"
          :page-size="limit"
          show-total
        />
      </div>
    </div>

  </div>
</template>




<script>
import { 
  get_anchor_list_page,
  set_Anchor_Recommend_state
} from '@/service/index';
import mixin from '@/mixins/single-form-mixin'
export default {
  name: "anchor-config",
  mixins: [mixin],
  props:{
    form:Object
  },
  data(){
    return{
      title: '',
      platformId: 0,
      columns:[
        {
          title: '主播名称',
          key: 'title'
        },
        {
          title: '主播头像',
          slot: 'img'
        },
        {
          title: '是否推荐',
          slot: 'recommend'
        },
        {
          title: '在线状态',
          slot: 'status'
        },
        {
          title: '操作',
          slot: 'action',
          width:180
        },
      ],
      rules:{}
    }
  },
  computed:{
    defaultForm(){
      return [
        {
          label: '主播名称',
          type: 'text',
          field: 'title'
        },
        {
          type: 'radioButton',
          label: '主播在线状态',
          options: [
            {label:'在线',value:'true'},
            {label:'下线',value:'false'},
          ],
          field: 'status'
        },
        {
          type: 'radioButton',
          label: '是否推荐',
          options: [
            {label:'是',value:'true'},
            {label:'否',value:'false'},
          ],
          field: 'recommend'
        },
      ]
    },
    moreForm(){
      return []
    }
  },
  methods:{
    async setRecommend(value,row,index){
      let state
      let title
      if(value == true){
        state = true
        title = '开启推荐'
      }else{
        state = false
         title = '关闭推荐'
      }
      this.$Modal.confirm({
        title: `${title}`,
        loading: true,
        content: `<p>是否${title}？</p>`,
        onOk: async () => {
          this.btnLoading = true;
          const res = await set_Anchor_Recommend_state(row.id, state);
          this.btnLoading = false;
          if (res.status < 400) {
            this.$Message.success(`${title}成功`);
            this.$Modal.remove();
            // this.getData();
          } else {
            if (value == true) {
              row.recommend = false;
            } else {
              row.recommend = true;
            }
            this.data.splice(index,1,row);
            this.$Modal.remove();
          }
        },
        onCancel: () => {
          if (value == true) {
            row.recommend = false;
          } else {
            row.recommend = true;
          }
          this.data.splice(index,1,row);
        }
      });
    },
    async getData() {
      this.loading = true;
      const res = await get_anchor_list_page(this.platformId ,this.page, this.limit, this.query);
      this.loading = false;
      if (res.status < 400) {
        this.total = res.data.itemTotal;
        this.data = res.data.itemList;
      }
    },
    init(){
      this.platformId = this.form.id;
    },
  },
  created() {
    this.platformId = this.form.id;
  },
}
</script>
<style lang="less" scoped>
  .title_header{width: 100%;font-weight: 600;font-size: 18px;margin-bottom: 30px;}
</style>