<template>
    <div class="listing">
        <v-data-table
            :headers="headers"
            :items="rows"
            :items-per-page="5"
        ></v-data-table>
    </div>
</template>
<script>
export default {
    props:['headers','rows'],
    name:'DataListing',
    data(){
        return {

        }
    }
}
</script>