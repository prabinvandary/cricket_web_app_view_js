<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew"/>
          <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected"
                  :disabled="!selectedPlayers || !selectedPlayers.length"/>
        </template>

        <template #end>
          <FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import"
                      class="mr-2 inline-block"/>
          <Button label="Export" icon="pi pi-upload" severity="help" @click="exportCSV($event)"/>
        </template>
      </Toolbar>

      <DataTable ref="dt" :value="players" v-model:selection="selectedPlayers" dataKey="id"
                 :paginator="true" :rows="10" :filters="filters"
                 paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                 :rowsPerPageOptions="[5,10,25]"
                 currentPageReportTemplate="Showing {first} to {last} of {totalRecords} players">
        <template #header>
          <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
            <h4 class="m-0">Manage Products</h4>
            <span class="p-input-icon-left">
                            <i class="pi pi-search"/>
                            <InputText v-model="filters['global'].value" placeholder="Search..."/>
                        </span>
          </div>
        </template>

        <Column selectionMode="multiple" style="width: 3rem" :exportable="false"></Column>
        <Column field="id" header="id" sortable style="min-width:12rem"></Column>
        <Column field="name" header="Name" sortable style="min-width:16rem"></Column>
        <Column field="address" header="Address" sortable style="min-width:10rem"></Column>
        <Column field="playerRole" header="Player Role" sortable style="min-width:10rem"></Column>
        <Column :exportable="false" style="min-width:8rem">
          <template #body="slotProps">
            <Button icon="pi pi-pencil" outlined rounded class="mr-2" @click="editPlayer(slotProps.data)"/>
            <Button icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeletePlayer(slotProps.data)"/>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog v-model:visible="playerDialog" :style="{width: '450px'}" header="Player Details" :modal="true"
            class="p-fluid">
      <div class="field">
        <label for="name">Name</label>
        <InputText id="name" v-model.trim="player.name" required="true" autofocus
                   :class="{'p-invalid': submitted && !player.name}"/>
        <small class="p-error" v-if="submitted && !player.name">Name is required.</small>
      </div>
      <div class="field">
        <label for="address">Address</label>
        <InputText id="address" v-model.trim="player.address" required="true" autofocus
                   :class="{'p-invalid': submitted && !player.address}"/>
        <small class="p-error" v-if="submitted && !player.address">Address is required.</small>
      </div>
      <div class="field">
        <label for="playerRole">PlayerRole</label>
        <InputText id="playerRole" v-model.trim="player.playerRole" required="true" autofocus
                   :class="{'p-invalid': submitted && !player.playerRole}"/>
        <small class="p-error" v-if="submitted && !player.playerRole">Player role is required.</small>
      </div>
      <template #footer>
        <Button label="Cancel" icon="pi pi-times" text @click="hideDialog"/>
        <Button label="Save" icon="pi pi-check" text @click="savePlayer"/>
      </template>
    </Dialog>

    <Dialog v-model:visible="deletePlayerDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
        <span v-if="player">Are you sure you want to delete <b>{{ player.name }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deletePlayerDialog = false"/>
        <Button label="Yes" icon="pi pi-check" text @click="deletePlayer"/>
      </template>
    </Dialog>

    <Dialog v-model:visible="deletePlayersDialog" :style="{width: '450px'}" header="Confirm" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem"/>
        <span v-if="player">Are you sure you want to delete the selected players?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deletePlayersDialog = false"/>
        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedPlayers"/>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {FilterMatchMode} from 'primevue/api';
import {useToast} from 'primevue/usetoast';
import {PlayerService} from "@/api/PlayerService";

onMounted(() => {
  PlayerService.getPlayer().then((data) => (players.value = data));
});

const toast = useToast();
const dt = ref();
const players = ref();
const playerDialog = ref(false);
const deletePlayerDialog = ref(false);
const deletePlayersDialog = ref(false);
const player = ref({
  id: null,
  name: '',
  address: '',
  playerRole: ''
});
const selectedPlayers = ref();
const filters = ref({
  'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});
const submitted = ref(false);


const openNew = () => {
  player.value = {
    id: null,
    name: '',
    address: '',
    playerRole: ''
  };
  submitted.value = false;
  playerDialog.value = true;
};
const hideDialog = () => {
  playerDialog.value = false;
  submitted.value = false;
};
const savePlayer = () => {
  console.log(player.value)
  PlayerService.savePlayer(player.value);
  submitted.value = true;

  playerDialog.value = false;
  player.value = {
    id: null,
    name: '',
    address: '',
    playerRole: ''
  };

};
const editPlayer = (prod) => {
  playerDialog.value = true;
};
const confirmDeletePlayer = (prod) => {
  deletePlayerDialog.value = true;
};
const deletePlayer = () => {
  deletePlayerDialog.value = false;
  player.value = {
    id: null,
    name: '',
    address: '',
    playerRole: ''
  };
  toast.add({severity: 'success', summary: 'Successful', detail: 'Player Deleted', life: 3000});
};


const exportCSV = () => {
  dt.value.exportCSV();
};
const confirmDeleteSelected = () => {
  deletePlayersDialog.value = true;
};
const deleteSelectedPlayers = () => {
  deletePlayersDialog.value = false;
  selectedPlayers.value = null;
  toast.add({severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
};


</script>
