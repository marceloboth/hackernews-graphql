<template>
  <div>
    <div class="flex flex-column mt3">
      <input
        class="mb2"
        v-model="description"
        type="text"
        placeholder="A description for the link">
      <input
        class="mb2"
        v-model="url"
        type="text"
        placeholder="The URL for the link">
    </div>
    <button @click="createLink()">Submit</button>
  </div>
</template>

<script>
import { CREATE_LINK_MUTATION } from '../constants/graphql'

export default {
  name: 'CreateLink',
  data () {
    return {
      description: '',
      url: ''
    }
  },
  methods: {
    createLink () {
      const { description, url } = this.$data
      this.$apollo.mutate({
        mutation: CREATE_LINK_MUTATION,
        variables: {
          description,
          url
        }
      })
    }
  }
}
</script>
