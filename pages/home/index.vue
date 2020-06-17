<template>
  <div class="c-home">
    <background-railways />
    <div class="c-home__container">
      <div class="c-home__heading-container">
        <h1 class="c-home__heading u-typo u-typo__h1 u-typo--black u-typo--uppercase">
          Explore swiss railway stations
        </h1>
        <h4 class="c-home__subheading u-typo__h4 u-typo--extra-bold u-typo--uppercase">
          An interactive map that let you explore the dense network <br>of railway stations in Switzerland
        </h4>
      </div>
      <div class="c-home__content-container">
        <div>
          <div class="c-home__map">
            <gmap-map
              :center="{lat: stationsCoordinates.length && stationsCoordinates[0].lat,lng: stationsCoordinates.length && stationsCoordinates[0].lng}"
              :zoom="7"
              map-type-id="roadmap"
              style="width: 900px; height: 440px"
            >
              <google-map-cluster
                :grid-size="30"
                :zoom-on-click="true"
                :enable-retina-icons="true"
                :minimumc-cluster-size="3"
              >
                <gmap-info-window
                  :options="infoOptions"
                  :position="infoWindowPos"
                  :opened="infoWinOpen"
                  @closeclick="clearCard"
                />
                <gmap-marker
                  v-for="(marker, index) in stationsCoordinates"
                  :key="index"
                  :position="{lat: marker.lat, lng: marker.lng}"
                  :clickable="true"
                  :draggable="true"
                  @click="toggleInfoWindow(marker,index)"
                />
              </google-map-cluster>
            </gmap-map>
          </div>
          <div class="c-home__map-annotation">
            <p class="c-home__map-annotation-text">
              Based on data from
            </p>
            <img
              src="~assets/images/logo_cff.png"
              alt="Swiss Railways logo SBB CFF FFS"
              class="c-home__map-annotation-img"
            >
          </div>
        </div>
        <div class="c-home__cards-container">
          <card
            v-for="station in stations"
            :key="station.recordid"
            :item="station"
            @info="showInfo"
          />
          <infinite-loading @infinite="infiniteHandler" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GoogleMapCluster from 'vue2-google-maps/dist/components/cluster'
  import InfiniteLoading from 'vue-infinite-loading'
  import BackgroundRailways from '@/components/background'
  import Card from '@/components/card'
  import { LOUNGE, LUGGAGE, LUGGAGE_2, MONEY_TRANSFER, MONEY_TRANSFER_2 } from '@/components/card/enums'
  import stationServicesMixin from '@/mixins/station-services-mixin'

  const RESULTS_PER_PAGE = 10

  export default {
    name: 'HomePage',
    components: {
      BackgroundRailways,
      Card,
      GoogleMapCluster,
      InfiniteLoading
    },
    mixins: [
      stationServicesMixin
    ],
    data () {
      return {
        infoWindowPos: null,
        infoWinOpen: false,
        currentMidx: null,
        infoOptions: {
          content: '',
          pixelOffset: {
            width: 250,
            height: 50
          }
        },
        start: 0,
        stations: [],
        currentLocation: {},
        circleOptions: {},
        pins: {
          selected: '',
          notSelected: ''
        },
        mapStyle: [],
        clusterStyle: [
          {
            url: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m1.png',
            width: 56,
            height: 56,
            textColor: '#fff'
          }
        ],
        services: []
      }
    },
    computed: {
      stationsCoordinates () {
        return this.stations.map((station) => {
          return {
            name: station.fields.stationsbezeichnung,
            address: `${station.fields.adresse}, ${station.fields.plz} ${station.fields.ort}`,
            email: station.fields.mail,
            services: station.fields.service,
            id: station.recordid,
            lat: station.fields.geopos[0],
            lng: station.fields.geopos[1]
          }
        })
      }
    },
    methods: {
      // Duplicate code from Computed in Card - could be in a Mixin universal
      isLounge () {
        const loungeServices = [LOUNGE]
        return this.findServiceInStation(loungeServices)
      },
      isLuggage () {
        const luggageServices = [LUGGAGE, LUGGAGE_2]
        return this.findServiceInStation(luggageServices)
      },
      isMoneyTransfer () {
        const moneyServices = [MONEY_TRANSFER, MONEY_TRANSFER_2]
        return this.findServiceInStation(moneyServices)
      },
      showInfo (event) {
        this.services = event.fields.service.split(',').map(service => service.trim().toLowerCase())

        this.currentLocation = {
          name: event.fields.stationsbezeichnung,
          address: `${event.fields.adresse}, ${event.fields.plz} ${event.fields.ort}`,
          email: event.fields.mail,
          loungeService: this.isLounge(),
          luggageService: this.isLuggage(),
          moneyService: this.isMoneyTransfer(),
          id: event.recordid,
          lat: event.fields.geopos[0],
          lng: event.fields.geopos[1]
        }
        const index = this.stations.findIndex(item => item.recordid === event.recordid)
        this.toggleInfoWindow(this.currentLocation, index)
      },
      arrayUnique (data) {
        return data.reduce((acc, current) => {
          const found = acc.find(item => item.fields.ort === current.fields.ort)
          if (found) {
            return acc
          }
          return acc.concat([current])
        }, [])
      },
      infiniteHandler ($state) {
        return this.$store.dispatch('stations/GET', {
          dataset: 'kontaktadressen',
          facet: 'service',
          rows: RESULTS_PER_PAGE,
          start: this.start
        })
          .then(({ data }) => {
            const records = data.records

            if (records.length) {
              this.start += RESULTS_PER_PAGE
              this.stations = this.arrayUnique([...this.stations, ...records])
              $state.loaded()
            } else {
              $state.complete()
            }
          })
      },
      toggleInfoWindow (marker, idx) {
        this.infoWindowPos = { lat: marker.lat, lng: marker.lng }
        this.infoOptions.content = this.infoWindowContent(marker)

        if (this.currentMidx === idx) {
          this.infoWinOpen = !this.infoWinOpen
        } else {
          this.infoWinOpen = true
          this.currentMidx = idx
        }
      },
      infoWindowContent (marker) {
        const lounge = marker.loungeService ? '<i class="c-info-window__service-icon o-icon o-icon--lounge"></i>' : ''
        const luggage = marker.luggageService ? '<i class="c-info-window__service-icon o-icon o-icon--luggage"></i>' : ''
        const money = marker.moneyService ? '<i class="c-info-window__service-icon o-icon o-icon--money-exchange"></i>' : ''

        return `
          <div class="c-info-window">
            <div>
              <h3 class="c-info-window__heading u-typo--extra-bold">
                ${marker.name}
              </h3>
              <h5 class="c-info-window__subheading">
                ${marker.address}
              </h5>
              <p class="c-info-window__email">
                ${marker.email}
              </p>
              <div class="c-info-window__services">
                <div class="c-info-window__service">
                  ${lounge}
                </div>
                <div class="c-info-window__service">
                  ${luggage}
                </div>
                <div class="c-info-window__service">
                  ${money}
                </div>
              </div>
            </div>
          </div>
        `
      },
      clearCard () {
        this.infoWinOpen = false
        // method to subscribe on close click and clear isActive for clicked Card from Google API
        // setOnInfoWindowCloseListener(OnInfoWindowCloseListener)
      }
    }
  }
</script>

<style lang="scss" src="./styles.scss" />
