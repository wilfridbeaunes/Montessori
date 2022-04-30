import { ref } from "vue";

const getActivity = (id) => {
  const activity = ref(null);
  
  const error = ref(null);

  const load = async () => {
    try {
      let data = await fetch("http://localhost:4000/activities/" + id);
      if (!data.ok) {
        throw Error("this activity doesn't exists");
      }
      activity.value = await data.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  return { activity, load };
};

export default getActivity;
