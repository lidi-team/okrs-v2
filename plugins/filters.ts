import  Vue  from  "vue";

Vue.filter("round",  function(value: number)  {
  return Math.round(value * 100) / 100;
});


Vue.filter("isUpProgress", function(value: Number): string {
  return value > 0 ? 'happy' : 'sad';
})

Vue.filter("verifyProgress", function(value: any): number {
  if(isNaN(value) || value === Infinity) {
    return 0;
  } else return Number(value)
})