<template>
  <div>
    <h1>Technical Report</h1>
    <!-- Use v-html to render HTML correctly -->
    <pre v-if="formattedResponse" v-html="formattedResponse"></pre>
    <p v-else>No data available</p>
  </div>
</template>


<script setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'

const route = useRoute()
const responseData = ref('')

// Use a computed property to handle any necessary text formatting
const formattedResponse = computed(() => {
  if (responseData.value.length > 0) {
    return responseData.value
        // Convert line breaks to HTML <br> tags
        .replace(/\n/g, '<br>')
        // Wrap words that start with a capital letter and end with a colon in <strong> tags
        .replace(/([A-Z][a-z]+(?: [A-Z][a-z]+)*:)/g, '<strong>$1</strong>');
  }
  return null;
});

onMounted(() => {
  console.log('route.query.data:', route.query.data);
  if (route.query.data) {
    responseData.value = JSON.parse(route.query.data); // Parse the data from the query parameter
  }
});
</script>



<style scoped>
h1 {
  margin-top: 1em;
  color: #2c3e50;
  text-align: center;
  font-size: 24px; /* Adjust the font size */
  font-weight: bold; /* Make the heading bold */
}

pre {
  background-color: white;
  padding: 20px; /* Increased padding for better spacing */
  border-radius: 5px;
  font-family: monospace; /* Ensures the font is suitable for code */
  white-space: pre-wrap; /* Wraps text in the container */
  word-break: break-word; /* Ensures long words do not overflow */
  overflow-y: auto; /* Adds scroll to the pre tag if content is too long */
  border: 1px solid #ccc; /* Add a border */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
}
</style>