export function Stations ($http) {
  const BASE_URL = 'https://data.sbb.ch/api/records/1.0/search'
  return {
    get ({ dataset, facet, rows, start }) {
      const params = {
        dataset,
        facet,
        rows,
        start
      }
      return $http.get(`${BASE_URL}`, {
        params
      })
    }
  }
}
