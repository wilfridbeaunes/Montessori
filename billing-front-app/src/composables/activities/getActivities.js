import { ref } from "vue";

const getActivities = () => {
  const activities = ref([]);
  const error = ref(null);

  const load = async () => {
    try {
      let data = await fetch("http://localhost:4000/activities/");
      if (!data.ok) {
        throw Error("this activity doesn't exists");
      }
      activities.value = await data.json();
    } catch (err) {
      error.value = err.message;
    }
  };

  return { activities, error, load };
};

export default getActivities;
