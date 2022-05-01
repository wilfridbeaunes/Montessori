<template>
  <Dialog
    v-model:visible="showMessage"
    :breakpoints="{ '960px': '80vw' }"
    :style="{ width: '30vw' }"
    position="top"
  >
    <div class="flex align-items-center flex-column pt-6 px-3">
      <i
        class="pi pi-check-circle"
        :style="{ fontSize: '5rem', color: 'var(--green-500)' }"
      ></i>
      <h5>Activity Added successfully!</h5>
      <p :style="{ lineHeight: 1.5 }">
        Activity Name: <b>{{ state.name }}</b>
        <br />
        Activity Price: <b>{{ state.price }}</b> $USD.
        <br />
        Activity Description: <b>{{ state.description }}</b>
      </p>
    </div>
    <template #footer>
      <div class="flex justify-content-center">
        <Button
          label="Show All Activities"
          @click="redirectActivities"
          class="p-button-text p-button-secondary"
        />
        <Button
          label="Add Another Activity"
          @click="toggleDialog"
          class="p-button-text p-button-info"
        />
      </div>
    </template>
  </Dialog>

  <Card class="card">
    <template #title>
      <div class="text-center">Create Activity</div>
    </template>
    <template #subtitle>
      <div class="subtitle">fields with * are required</div>
    </template>
    <template #content>
      <div class="flex justify-content-center">
        <form @submit.prevent="handleSubmit(!v$.$invalid)" class="p-fluid">
          <div class="field">
            <label
              for="name"
              :class="{ 'p-error': v$.name.$invalid && submitted }"
              >Name*</label
            >
            <InputText
              id="name"
              v-model="v$.name.$model"
              :class="{ 'p-invalid': v$.name.$invalid && submitted }"
            />
            <div
              v-if="
                (v$.name.$invalid && submitted) || v$.name.$pending.$response
              "
              class="p-error small-error"
            >
              {{ v$.name.required.$message.replace("Value", "Name") }}
            </div>
          </div>

          <div class="field">
            <label
              for="price"
              :class="{ 'p-error': v$.price.$invalid && submitted }"
              >Price*</label
            >
            <InputNumber
              id="price"
              v-model="v$.price.$model"
              :class="{ 'p-invalid': v$.price.$invalid && submitted }"
              :min="0"
              showButtons
              mode="currency"
              currency="USD"
            />
            <div
              v-if="
                (v$.price.$invalid && submitted) || v$.price.$pending.$response
              "
              class="p-error small-error"
            >
              {{ v$.price.required.$message.replace("Value", "Price") }}
            </div>
          </div>

          <div class="field">
            <label
              for="description"
              :class="{ 'p-error': v$.description.$invalid && submitted }"
              >Description*</label
            >
            <Textarea
              id="description"
              v-model="v$.description.$model"
              :class="{ 'p-invalid': v$.description.$invalid && submitted }"
              :autoResize="true"
              rows="5"
              cols="30"
              placeholder="Enter Activity Description"
            />
            <div
              v-if="
                (v$.description.$invalid && submitted) ||
                v$.description.$pending.$response
              "
              class="p-error small-error"
            >
              {{
                v$.description.required.$message.replace("Value", "Description")
              }}
            </div>
          </div>

          <div class="bottom-card-buttons">
            <Button
              type="secondary"
              label="Show all Activities"
              class="mt-2 mr-1 p-button-secondary"
            />
            <Button
              type="submit"
              label="Add Activity"
              class="mt-2 ml-1"
              icon="pi pi-plus"
              iconPos="right"
            />
          </div>
        </form>
      </div>
    </template>
  </Card>
</template>

<script>
import { reactive, ref } from "vue";
import { required, numeric, minValue } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useRouter } from "vue-router";
//TODO import { isNewActivity, addActivity } from "";

export default {
  setup() {
    const state = reactive({
      name: "",
      price: "",
      description: "",
    });

    const rules = {
      name: { required },
      price: { required, numeric, minValueValue: minValue(0) },
      description: { required },
    };

    const submitted = ref(false);
    const showMessage = ref(false);

    const v$ = useVuelidate(rules, state);

    const handleSubmit = (isFormValid) => {
      submitted.value = true;

      const newActivity = {
        name: state.name,
        price: state.price,
        description: state.description,
      };
      const jsonNewActivity = JSON.stringify(newActivity);
      console.log(jsonNewActivity);

      //TODO const isNew = isNewActivity(jsonNewActivity);

      if (!isFormValid /* || !isNew*/) {
        return;
      }

      //TODO await addActivity(jsonNewActivity);
      toggleDialog();
    };
    const toggleDialog = () => {
      showMessage.value = !showMessage.value;

      if (!showMessage.value) {
        resetForm();
      }
    };
    const resetForm = () => {
      state.name = "";
      state.price = "";
      state.description = "";
      submitted.value = false;
    };

    const router = useRouter();
    const redirectActivities = () => {
      router.push({ name: "show-activities" });
    };

    return {
      state,
      v$,
      handleSubmit,
      toggleDialog,
      redirectActivities,
      submitted,
      showMessage,
    };
  },
};
</script>

<style scoped>
.card {
  margin: 5rem auto;
  padding: 2rem;
  width: fit-content;
}
.field {
  margin-bottom: 1.5rem;
}
.subtitle,
.small-error {
  font-size: 0.7rem;
}
.bottom-card-buttons {
  display: flex;
}
</style>
