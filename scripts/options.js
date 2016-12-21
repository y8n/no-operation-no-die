// 注：必须使用CSP版本的Vue
Vue.component('modal', {
    template: '#modal-template',
    data: function(){
        return {
            modalHeader: ''
        };
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            twoWay: true
        },
        onClose: {
            type: Function
        },
        item: {
            type: Object
        },
        type: {
            type: String
        }
    },
    ready: function(){
        if(this.type === 'add'){
            this.modalHeader = '添加';
        }else {
            this.modalHeader = '编辑';
        }
    },
    computed: {
        disabledBtn: function(){
            return !this.item.name || !this.item.url;
        }
    },
    methods: {
        keyUpHandler: function(){
            if(this.disabledBtn){
                return;
            }
            this.onCloseHandler();
        },
        onCloseHandler: function() {
            this.show = false;
            this.onClose({
                name: this.item.name,
                url: this.item.url,
                avaliable: this.item.avaliable || false
            });

        }
    }
})

var app = new Vue({
    el: '#app',
    data: {
        list: [],
        showModal: false,
        editItem: {},
        editIndex: -1,
        modalType: 'add',
        query: '' // 过滤条件
    },
    methods: {
        addItemHandler: function() {
            this.modalType = 'add';
            this.showModal = true;
        },
        toggleItemHandler: function(item) {
            item.avaliable = !item.avaliable;
            this.saveLocalStorage();
        },
        deleteItemHandler: function(item) {
            this.list.$remove(item);
            this.saveLocalStorage();
        },
        editItemHandler: function(item) {
            this.modalType = 'edit';
            this.showModal = true;
            this.editIndex = this.list.indexOf(item);
            this.editItem = {
                name: item.name,
                url: item.url,
                avaliable: item.avaliable
            };
        },
        onModalCloseHandler:function(item){
            if(this.modalType === 'add'){
                this.list.push(item);
            } else if(this.modalType === 'edit'){
                if(this.editIndex !== -1){
                    this.list.$set(this.editIndex, item);
                }
            }
            this.editIndex = -1;
            this.editItem = {};
            this.saveLocalStorage();
        },
        saveLocalStorage: function(){
            chrome.storage.local.set({
                urlList: this.list
            });
        }
    },
    ready: function() {
        var vm = this;
        chrome.storage.local.get('urlList', function(items) {
            vm.list = items.urlList || [];
        });
    }
});
