<template>
  <a 
    :href="url">
    {{ name }}，
  </a>
</template>
<script>
import { INVESTMENT_TYPES, COURSE_ID } from "../api/index.js";
let INVESTMENT = INVESTMENT_TYPES[COURSE_ID];
if (!Object.keys(INVESTMENT_TYPES).includes(COURSE_ID)) {
  INVESTMENT = INVESTMENT_TYPES[4392];
}
export default {
  data() {
    return {
      name: INVESTMENT.name,
      url: INVESTMENT.url,
    };
  },
};
</script>


