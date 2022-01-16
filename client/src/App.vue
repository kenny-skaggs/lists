<template>
  <div id="app">
    <b-navbar>
      <template #brand>
        <span>Bakin' Bits</span>
      </template>
    </b-navbar>
    <div class="container main-container">
      <div class="columns">
        <router-view/>
      </div>
    </div>
  </div>
</template>
