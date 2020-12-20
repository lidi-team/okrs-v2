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

Vue.filter("filterImage", function(value: string): string {
  return value ? value : 'https://i.pinimg.com/originals/db/da/a0/dbdaa0afe2db00c70d5550494e8a5594.gif'
})
