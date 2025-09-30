<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 flex flex-col">
  <nav class="navbar w-full">
    <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span class="main-text">MyTodoApp</span>
    </div>
  </nav>

    <!-- Content -->
    <div class="flex flex-col items-center flex-1 py-16 px-4">
      <!-- Todo List Container -->
      <div class="w-full max-w-3xl bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-12">
        <TodoList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TodoList from './TodoList.vue'; // <-- path ถูกต้อง

export default defineComponent({
  components: { TodoList },
});
</script>

<style scoped>
.navbar {
  /* ทำเป็น gradient โปร่งใส */
  background: linear-gradient(90deg, rgba(59,130,246,0.9) 0%, rgba(168,85,247,0.9) 100%);
  backdrop-filter: blur(12px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  position: sticky;
  top: 0;
  z-index: 50;
    /* เพิ่มความมน */
  border-radius: 15px 15px 20px 20px; /* มนเฉพาะขอบล่าง */
}


/* ขยายให้สูงขึ้น */
.navbar .max-w-7xl {
  padding-top: 1.5rem;  /* 24px */
  padding-bottom: 1.5rem; 
}

/* ถ้าอยากปรับ text */
.main-text {
  font-size: 2.2rem;
  font-weight: 800;
  color: #ffffff; /* สีขาวตัดกับ gradient */
  letter-spacing: 1px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.2);
  transition: transform 0.3s ease;
    /* ขยับไปทางขวา 10px */
  transform: translateX(10px);
}

.main-text:hover {
  transform: scale(1.05);
}

.main {
  font-family: 'Inter', 'Avenir', Helvetica, Arial, sans-serif;
}

h1 {
  transition: all 0.3s ease;
}

h1:hover {
  transform: scale(1.05);
  color: #1e40af;
}
</style>