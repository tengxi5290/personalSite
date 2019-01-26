import {axiosProxy,checkErrorCode} from "@/api/tool"
export default {
    data() {
        return {
            
        }
    },
    methods: {
    	// 时间戳转换成标准时间
        timestampToTime(timestamp) {
	        var date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
			var Y = date.getFullYear() + '/'
			var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/'
			var D
			if(date.getDate() < 10) {
			    D = '0' + date.getDate() + ' '
			} else {
			    D = date.getDate() + ' '
			}
			var h = date.getHours() + ':'
			var m
			var s = date.getSeconds()
			if(date.getMinutes() < 10) {
			    m = '0' + date.getMinutes()
			} else {
			    m = date.getMinutes()
			}
			return Y+M+D+h+m+s
	    },
	    resort (array) {
		    for(let i=0;i<array.length-1;i++){
		        for(let j=0;j<array.length-1-i;j++){
		            if(array[j].priority>array[j+1].priority){
		                var temp=array[j];
		                array[j]=array[j+1];
		                array[j+1]=temp;
		            }
		        }
		    }
		    return array
	    },
    }
}