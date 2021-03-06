<template>
  <div class="flex mt2 items-start">
    <div class="flex items-center">
      <span class="gray">{{linkNumber}}.</span>
      <div v-if="userId" class="ml1 gray f11 upvote" @click="voteForLink()">▲</div>
    </div>
    <div class="ml1">
      <a :href="link.url" class="link">{{link.description}} ({{link.url}})</a>
      <div class="f6 lh-copy gray">
        {{link.votes.length}} votes | by {{link.postedBy ? link.postedBy.name : 'Unknown'}} {{timeDifferenceForDate(link.createdAt)}}
      </div>
    </div>
  </div>
</template>

<script>
import { timeDifferenceForDate } from '../utils'
import { ALL_LINKS_QUERY, CREATE_VOTE_MUTATION } from '../constants/graphql'
import { GC_USER_ID, LINKS_PER_PAGE } from '../constants/settings'

export default {
  name: 'LinkItem',
  props: ['link', 'index', 'pageNumber'],
  data () {
    return {
      linksPerPage: LINKS_PER_PAGE
    }
  },
  computed: {
    userId () {
      return this.$root.$data.userId
    },
    linkNumber () {
      if (this.$route.path.includes('new')) {
        return (this.pageNumber - 1) * this.linksPerPage + (this.index + 1)
      } else {
        return this.index + 1
      }
    }
  },
  methods: {
    timeDifferenceForDate,

    voteForLink () {
      const userId = localStorage.getItem(GC_USER_ID)
      const voterIds = this.link.votes.map(vote => vote.user.id)
      if (voterIds.includes(userId)) {
        alert(`User (${userId}) already voted for this link.`)
        return
      }
      const linkId = this.link.id
      this.$apollo.mutate({
        mutation: CREATE_VOTE_MUTATION,
        variables: {
          userId,
          linkId
        },
        update: (store, { data: { createVote } }) => {
          this.updateStoreAfterVote(store, createVote, linkId)
        }
      })
    },

    updateStoreAfterVote (store, createVote, linkId) {
      const data = store.readQuery({
        query: ALL_LINKS_QUERY,
        variables: {
          first: 5,
          skip: 0,
          orderBy: 'createdAt_DESC'
        }
      })
      const votedLink = data.allLinks.find(link => link.id === linkId)
      votedLink.votes = createVote.link.votes
      store.writeQuery({query: ALL_LINKS_QUERY, data})
    }
  }
}
</script>

<style scoped>
  .upvote {
    cursor: pointer;
  }

  .link {
    text-decoration: none;
    color: black;
  }
</style>
