export default {
  methods: {
    findServiceInStation (services) {
      return services
        .map(service => !!this.services.find(name => name === service.toLowerCase()))
        .some(el => el === true)
    }
  }
}
