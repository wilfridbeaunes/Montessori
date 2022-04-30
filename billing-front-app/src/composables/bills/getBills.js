import { ref } from "vue";

const getBills = () => {
  const bills = ref([]);
  const error = ref(null);

  const load = async () => {
    try {
      let data = await fetch("http://localhost:4000/bills/");
      if (!data.ok) {
        throw Error("no bills available");
      }
      bills.value = await data.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  return { bills, load };
};

export default getBills;
