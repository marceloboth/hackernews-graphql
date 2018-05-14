<template>
  <div>
    <!-- 1 -->
    <h4 v-if="loading">Loading...</h4>
    <link-item
      v-for="(link, index) in allLinks"
      :key="link.id"
      :link="link"
      :index="index">
    </link-item>
  </div>
</template>

<script>
import { ALL_LINKS_QUERY, NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from '../constants/graphql'
import LinkItem from './LinkItem'

export default {
  name: 'LinkList',
  data () {
    return {
      allLinks: [],
      loading: 0
    }
  },
  components: {
    LinkItem
  },
  apollo: {
    allLinks: {
      query: ALL_LINKS_QUERY,
      subscribeToMore: [
        {
          document: NEW_LINKS_SUBSCRIPTION,
          updateQuery: (previous, { subscriptionData }) => {
            if (!subscriptionData.data.Link) return

            const newAllLinks = [
              subscriptionData.data.Link.node,
              ...previous.allLinks
            ]
            const result = {
              ...previous,
              allLinks: newAllLinks
            }
            return result
          }
        },
        {
          document: NEW_VOTES_SUBSCRIPTION,
          updateQuery: (previous, { subscriptionData }) => {
            if (!subscriptionData.data.Vote) return

            const votedLinkIndex = previous.allLinks.findIndex(link => link.id === subscriptionData.data.Vote.node.link.id)
            const link = subscriptionData.data.Vote.node.link
            const newAllLinks = previous.allLinks.slice()
            newAllLinks[votedLinkIndex] = link
            const result = {
              ...previous,
              allLinks: newAllLinks
            }
            return result
          }
        }
      ]
    }
  }
}
</script>
