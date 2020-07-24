<template>
    <div>
        <el-button type="primary" @click='logout'>退出</el-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            
        }
    },
    methods:{
        logout() {
           window.sessionStorage.clear();
           this.$message({
               message:"退出成功",
               duration:2000
           });
           this.$router.push("/login");
        }
    }
}
</script>

<style>

</style>