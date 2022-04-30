<template>
  <Menubar :model="items">
    <template #start>
      <img alt="logo" src="@/assets/img/logo.svg" height="40" class="ml-4" />
    </template>
    <Router-link :to="item.to" custom>
      {{ item.label }}
    </Router-link>
    <!-- <template #end>After</template> -->
  </Menubar>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const items = ref([
      {
        label: "Home",
        icon: "pi pi-fw pi-home",
        to: "/",
      },
      {
        label: "Activities",
        icon: "pi pi-fw pi-paperclip",
        items: [
          {
            label: "list all",
            icon: "pi pi-fw pi-list",
            to: "/show-activities",
          },
          {
            label: "new activity",
            icon: "pi pi-fw pi-plus",
            to: "/create-activity",
          },
        ],
      },
      {
        label: "Bills",
        icon: "pi pi-fw pi-money-bill",
        items: [
          {
            label: "list all",
            icon: "pi pi-fw pi-list",
            to: "/show-bills",
          },
          {
            label: "new bill",
            icon: "pi pi-fw pi-plus",
            to: "/create-bill",
          },
        ],
      },
      {
        label: "Dashboard",
        icon: "pi pi-fw pi-chart-line",
        to: "/dashboard",
      },
      // {
      //   label: "Parameters",
      //   icon: "pi pi-fw pi-cog",
      //   to: "paramPage",
      // },
    ]);

    return { items };
  },
};
</script>

<style></style>
