<template>
    <div class="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 flex justify-center items-start py-10 px-4">
        <div class="w-full max-w-3xl bg-white/95 backdrop-blur-sm rounded-md shadow-lg p-6 sm:p-8">

            <!-- Header -->
            <h1 class="fashion-title">
                 Todo List
            </h1>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4 mb-6 flex-wrap">
                <button @click="deleteSelected" :disabled="!hasSelected"
                    class="Del-bt bg-red-500 text-white rounded-md px-4 py-2 font-semibold shadow hover:bg-red-600 hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    Delete Selected
                </button>
                <button @click="toggleSelectAll" class="SelectAll-bt">
                    {{ allSelected ? 'Deselect All' : 'Select All' }}
                </button>
                <button @click="showAddInput = !showAddInput" class="AddTodo-bt">
                    Add Todo
                </button>

            </div>


            <!-- Add Todo Modal -->
            <transition name="fade">
                <div v-if="showAddInput" class="modal-overlay">
                    <div class="modal-backdrop" @click="cancelAdd"></div>
                    <div class="add-edit-box">
                        <h3 class="text-3xl font-bold text-pink-600 mb-4 text-center">Add New Fashion Todo</h3>
                        <input v-model="newTodo" type="text" placeholder="Enter your fashion task" />
                        <div class="flex justify-end gap-4 mt-4">
                            <button @click="cancelAdd" class="cancel-btn">Cancel</button>
                            <button @click="addTodo" class="add-btn">Add</button>
                        </div>
                    </div>
                </div>
            </transition>
            <!-- Edit Modal -->
            <transition name="fade">
                <div v-if="showModal" class="modal-overlay">
                    <div class="modal-backdrop" @click="closeModal"></div>
                    <div class="add-edit-box">
                        <h2 class="text-3xl font-bold text-pink-600 mb-4">Edit Todo</h2>
                        <input v-model="modalTodoTitle" type="text" placeholder="Enter your fashion task" />
                        <div class="flex justify-end gap-4">
                            <button @click="closeModal">Cancel</button>
                            <button @click="saveModalTodo">Save</button>
                        </div>
                    </div>
                </div>
            </transition>



            <!-- Todo Table Card -->
            <div class="crad">
                <div class="overflow-x-auto">
                    <table class="min-w-full table-auto border-collapse rounded-md overflow-hidden shadow-md">
                        <thead>
                            <tr class="bg-purple-200 text-purple-800">
                                <th class="px-4 py-2 text-left">id</th>
                                <th class="px-4 py-2 text-left">Task</th>
                                <th class="px-4 py-2 text-center">Done</th>
                                <th class="px-4 py-2 text-center">Select</th>
                                <th class="px-4 py-2 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(todo, index) in todos" :key="todo.id" class="hover:bg-purple-50 transition">
                                <td class="border px-4 py-2 text-pink-600 font-medium">{{ index + 1 }}</td>
                                <td class="border px-4 py-2"
                                    :class="{ 'line-through text-gray-400': todo.completed, 'text-purple-700': !todo.completed }">
                                    {{ todo.title }}
                                </td>
                                <td class="border px-4 py-2 text-center">
                                    <input type="checkbox" v-model="todo.completed" @change="toggleTodo(todo)"
                                        class="w-5 h-5 accent-pink-500" />
                                </td>
                                <td class="border px-4 py-2 text-center">
                                    <input type="checkbox" v-model="selectedTodos" :value="todo.id"
                                        class="w-5 h-5 accent-purple-400" />
                                </td>
                                <td class="border px-4 py-2 text-center flex justify-center gap-2">
                                    <button @click="openEditModal(todo)" class="Edit-bt">Edit</button>
                                    <button @click="deleteTodo(todo.id)" class="Delete-bt">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Empty State -->
            <p v-if="todos.length === 0" class="text-center text-gray-400 mt-6 italic">
                No fashion tasks yet. Add one!
            </p>



        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import axios from 'axios';

interface Todo {
    id: number;
    title: string;
    completed: boolean;
    created_at: string;
    updated_at: string;
}

export default defineComponent({
    setup() {
        const todos = ref<Todo[]>([]);
        const selectedTodos = ref<number[]>([]);
        const showAddInput = ref(false);
        const newTodo = ref('');

        // สำหรับ Edit Modal
        const showModal = ref(false);
        const editingTodo = ref<Todo | null>(null);
        const modalTodoTitle = ref('');

        const fetchTodos = async () => {
            const res = await axios.get('http://localhost:3000/api/todos');
            todos.value = res.data;
        };

        const addTodo = async () => {
            if (!newTodo.value.trim()) return;
            const res = await axios.post('http://localhost:3000/api/todos', {
                title: newTodo.value,
            });
            todos.value.unshift(res.data);
            newTodo.value = '';
            showAddInput.value = false;
        };

        const cancelAdd = () => {
            newTodo.value = '';
            showAddInput.value = false;
        };

        const toggleTodo = async (todo: Todo) => {
            await axios.put(`http://localhost:3000/api/todos/${todo.id}`, {
                completed: todo.completed,
            });
        };

        const deleteTodo = async (id: number) => {
            await axios.delete(`http://localhost:3000/api/todos/${id}`);
            todos.value = todos.value.filter((t) => t.id !== id);
            selectedTodos.value = selectedTodos.value.filter((tid) => tid !== id);
        };

        const toggleSelectAll = () => {
            if (allSelected.value) {
                selectedTodos.value = [];
            } else {
                selectedTodos.value = todos.value.map((t) => t.id);
            }
        };

        const deleteSelected = async () => {
            for (const id of selectedTodos.value) {
                await axios.delete(`http://localhost:3000/api/todos/${id}`);
            }
            todos.value = todos.value.filter((t) => !selectedTodos.value.includes(t.id));
            selectedTodos.value = [];
        };

        // Edit Modal Functions
        const openEditModal = (todo: Todo) => {
            editingTodo.value = todo;
            modalTodoTitle.value = todo.title;
            showModal.value = true;
        };

        const saveModalTodo = async () => {
            if (!modalTodoTitle.value.trim() || !editingTodo.value) return;
            const res = await axios.put(`http://localhost:3000/api/todos/${editingTodo.value.id}`, {
                title: modalTodoTitle.value,
            });
            const index = todos.value.findIndex(t => t.id === editingTodo.value?.id);
            if (index !== -1) todos.value[index] = res.data;
            closeModal();
        };

        const closeModal = () => {
            showModal.value = false;
            editingTodo.value = null;
            modalTodoTitle.value = '';
        };

        const allSelected = computed(() => todos.value.length > 0 && selectedTodos.value.length === todos.value.length);
        const hasSelected = computed(() => selectedTodos.value.length > 0);

        onMounted(fetchTodos);

        return {
            todos,
            selectedTodos,
            showAddInput,
            newTodo,
            addTodo,
            cancelAdd,
            toggleTodo,
            deleteTodo,
            toggleSelectAll,
            deleteSelected,
            allSelected,
            hasSelected,
            showModal,
            editingTodo,
            modalTodoTitle,
            openEditModal,
            saveModalTodo,
            closeModal,
        };
    },
});
</script>

<style>
.fashion-title {
    font-size: 3rem; /* ปรับขนาดใหญ่ขึ้น */
    font-weight: 800; /* extra bold */
    text-align: center;
    background: linear-gradient(90deg, #ec4899, #f472b6); /* gradient สีชมพู */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent; /* ทำ gradient กับ text */
    margin-bottom: 1.5rem;
    text-shadow: 2px 2px 6px rgba(236, 72, 153, 0.3); /* เงาอ่อนๆ */
    letter-spacing: 1px;
    transition: transform 0.3s ease, text-shadow 0.3s ease;
    cursor: default;
}

.fashion-title:hover {
    transform: scale(1.05); /* ขยายเล็กน้อยเวลาชี้ */
    text-shadow: 3px 3px 8px rgba(236, 72, 153, 0.5); /* เงาชัดขึ้น */
}

.flex.justify-end.gap-4.mb-6.flex-wrap {
    margin-bottom: 2rem;
    /* เพิ่มระยะห่างด้านล่างของกลุ่มปุ่ม */
}

/* หรือถ้าต้องการเพิ่มช่องว่างระหว่างปุ่มกับขอบกรอบทั้งหมด */
.Del-bt,
.SelectAll-bt,
.AddTodo-bt {
    margin-bottom: 0.5rem;
    /* เพิ่มช่องว่างด้านล่างปุ่ม */
}

/* Card scale-up animation */
@keyframes scale-up {
    0% {
        transform: scale(0.9);
        opacity: 0;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

.animate-scale-up {
    animation: scale-up 0.25s ease-out forwards;
}

.crad {
    width: 100%;
    max-width: 98%;
    background-color: #fff;
    border-radius: 16px;
    border: 2px solid #a78bfa;
    padding: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    position: relative;
    animation: scale-up 0.25s ease-out forwards;
}

.modal-overlay {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
    height: 100%;
    /* ครอบทั้งหน้าจอ */
    padding: 0;
    /* ลบ padding */
}



.add-edit-box {
    background: #ffffff;
    padding: 2.5rem 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
    z-index: 10;
    max-width: 450px;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    transform: scale(1);
    transition: transform 0.3s ease, opacity 0.3s ease;
    margin: auto;
    /* ทำให้แน่นอนอยู่ตรงกลาง */
}

/* Header */
.add-edit-box h2 {
    text-align: center;
    color: #ec4899;
    /* สีชมพูสดใส */
}

/* Input */
.add-edit-box input {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1rem;
    outline: none;
    transition: all 0.2s ease;
}

.add-edit-box input:focus {
    border-color: #ec4899;
    box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.2);
}

/* Buttons */
.add-edit-box .flex button {
    border-radius: 12px;
    padding: 0.6rem 1.5rem;
    font-weight: 600;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
}

.add-edit-box .flex button:first-child {
    background: #f3f4f6;
    color: #374151;
}

.add-edit-box .flex button:first-child:hover {
    background: #e5e7eb;
}

.add-edit-box .flex button:last-child {
    background: #ec4899;
    color: #ffffff;
}

.add-edit-box .flex button:last-child:hover {
    background: #db2777;
    transform: translateY(-2px);
}

/* สำหรับ transition ตอนเปิดปิด modal */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
}

/* Table styling */
table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 12px;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
    background-color: #fff;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

thead tr {
    background-color: #d8b4fe;
    color: #6b21a8;
    font-weight: 600;
    text-align: left;
}

tbody tr {
    background-color: #faf5ff;
    transition: all 0.2s ease;
}

tbody tr:hover {
    background-color: #f3e8ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

td,
th {
    padding: 12px 16px;
    vertical-align: middle;
}

.line-through {
    text-decoration: line-through;
    color: #9ca3af;
}

input[type="checkbox"] {
    width: 20px;
    height: 20px;
    accent-color: #ec4899;
    cursor: pointer;
}

.Edit-bt {
    background-color: #3b82f6;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.SelectAll-bt {
    background-color: #a78bfa;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.Del-bt {
    background-color: #ef4444;
    /* สีแดง */
    color: white;
    border: none;
    border-radius: 0.5rem;
    /* ขอบมน */
    padding: 0.5rem 1rem;
    /* px-4 py-2 */
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    transition: all 0.2s ease-in-out;
}

.Del-bt:hover {
    background-color: #dc2626;
    /* สีแดงเข้มขึ้น */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.Del-bt:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.AddTodo-bt {
    background-color: #ec4899;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.Delete-bt {
    background-color: #ef4444;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 8px 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}
</style>