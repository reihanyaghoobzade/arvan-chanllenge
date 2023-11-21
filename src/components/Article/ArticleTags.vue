<script setup>
import { computed, defineProps, defineEmits, ref } from 'vue'

const { allTags, articleTags, error } = defineProps({
  allTags: {
    type: Object,
    required: true
  },
  articleTags: {
    type: Array,
    default: () => []
  },
  error: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['onSelectTag'])
const selectedTags = ref([...articleTags])

const tagList = computed(() => {
  return [...(allTags?.tags || [])].sort()
})

const onSelectTag = (tag) => {
  if (selectedTags.value.includes(tag)) {
    selectedTags.value = selectedTags.value.filter((_tag) => _tag !== tag)
  } else {
    selectedTags.value?.push(tag)
  }

  emit('onSelectTag', selectedTags.value)
}
</script>

<template>
  <form class="d-flex flex-column justify-content-center">
    <div :class="['form-group', { 'mb-4': !error }]">
      <label for="tags" :class="['mb-2', { 'text-danger': error }]"> Tags </label>
      <input
        :value="selectedTags.join(', ')"
        type="title"
        :class="['form-control', { 'border-danger': error }]"
        id="tags"
        placeholder="Tags"
        readonly
      />
    </div>
    <p v-if="error" class="mb-4 mt-2 text-danger">{{ error }}</p>
    <div :class="['p-3 border rounded', { 'border-danger': error }]">
      <div class="form-check mb-2" v-for="tag in tagList" :key="tag">
        <input
          :id="tag"
          class="form-check-input"
          type="checkbox"
          :value="tag"
          :disabled="disabled"
          :checked="selectedTags.includes(tag)"
          @change="onSelectTag(tag)"
        />
        <label class="form-check-label w-100" :for="tag">{{ tag }}</label>
      </div>
    </div>
  </form>
</template>

<style scoped></style>
