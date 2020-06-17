export default {
  GET (_, { dataset, facet, rows, start }) {
    return this.$api
      .resources
      .stations
      .get({ dataset, facet, rows, start })
  }
}
