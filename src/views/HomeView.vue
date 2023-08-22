<script setup lang="ts"></script>

<template>
  <main class="container pt-5">
    <div class="row">
      <div
        class="col-sm-12 col-md-4 ml-4 py-2 px-2 bg-secondary rounded text-light text-center"
      >
        <h4>Statistics</h4>
        <div>Lorem ipsum dolor sit amet.</div>

        <div class="bg-light">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit
          dolores optio incidunt ducimus cupiditate aut vel porro ratione atque.
          Tempore consequatur cum fuga modi quam, distinctio sunt assumenda
          obcaecati natus!
        </div>
        <div>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quod,
          veritatis!
        </div>
      </div>
      <div class="col-8 px-4">
        <h2>Project Description - Bakrep</h2>

        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum
        recusandae, accusantium eligendi omnis dicta quae magni assumenda
        cupiditate voluptate suscipit quidem laboriosam ab sapiente quasi.
        Voluptate, ab minima. Veritatis, quod?
      </div>
    </div>
    <div class="row py-4">
      <div
        class="col btn btn-primary me-5 py-2"
        @click="$router.push('browse')"
      >
        Browse Genomes
      </div>
      <div class="col btn btn-light ms-5 py-2" @click="$router.push('search')">
        Go To Search
      </div>
    </div>
  </main>
</template>

<style></style>
