import { ref } from "vue";

const getBill = (id) => {
  const bill = ref(null);
  const error = ref(null);

  const load = async () => {
    try {
      let data = await fetch("http://localhost:4000/bills/" + id);
      if (!data.ok) {
        throw Error("this bill doesn't exists");
      }
      bill.value = await data.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  return { bill, load };
};

export default getBill;
