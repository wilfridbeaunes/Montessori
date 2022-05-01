<template>
  <h1>All activities</h1>

  <DataTable
    v-if="activities_"
    v-model:expandedRows="expandedRows"
    :value="activities_.value"
    dataKey="id"
    stripedRows
    responsiveLayout="stack"
    :paginator="true"
    :rows="5"
    removableSort
  >
    <!-- <template #header>
      <div class="table-header-container"></div>
    </template> -->
    <Column :expander="true" headerStyle="width: 3rem" />
    <Column field="name" header="Name" sortable></Column>
    <Column field="price" header="Price" sortable>
      <template #body="slotProps">
        {{ formatCurrency(slotProps.data.price) }}
      </template>
    </Column>
    <Column field="description" header="Description">
      <template #body="slotProps">
        {{ snippetDescription(slotProps.data.description) }}
      </template>
    </Column>
    <Column>
      <template #body="slotProps">
        <Button
          icon="pi pi-pencil"
          class="p-button-rounded p-button-primary mr-2"
          @click="editActivity(slotProps.data.id)"
        />
      </template>
    </Column>
    <Column>
      <template #body="slotProps">
        <Button
          icon="pi pi-trash"
          class="p-button-rounded p-button-danger"
          @click="deleteActivity(slotProps.data.id)"
        />
      </template>
    </Column>

    <template #expansion="slotProps">
      <h5 class="full-description-title">
        Full Description for {{ slotProps.data.name }}
      </h5>
      <div class="full-description">{{ slotProps.data.description }}</div>
    </template>
  </DataTable>
  <div v-else>
    <LoadingComponent></LoadingComponent>
  </div>
</template>

<script>
import { onMounted, ref } from "vue";
import getActivities from "../composables/activities/getActivities";
import LoadingComponent from "@/components/LoadingComponent.vue";
import { useRouter } from "vue-router";

export default {
  components: { LoadingComponent },
  setup() {
    const activities_ = ref();
    const error_ = ref();

    onMounted(async () => {
      const { activities, error, load } = getActivities();
      await load();
      activities_.value = activities;
      error_.value = error;
    });

    const formatCurrency = (value) => {
      return value + " $US";
    };

    const snippetDescription = (value) => {
      if (value.length <= 100) {
        return value.substring(0, 100);
      }
      return value.substring(0, 100) + "...";
    };

    const router = useRouter();
    const editActivity = (id_) => {
      router.push({ name: "edit-activity", params: { id: id_ } });
    };

    const expandedRows = ref([]);

    return {
      activities_,
      error_,
      formatCurrency,
      snippetDescription,
      expandedRows,
      editActivity,
    };
  },
};
</script>

<style scoped>
.full-description,
.full-description-title {
  text-align: justify;
  text-justify: inter-word;
  font-size: smaller;
}
</style>
